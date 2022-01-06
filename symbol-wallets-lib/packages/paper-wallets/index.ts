/*
 * Copyright 2020 NEM (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */

import { PDFDocument, PDFFont, PDFName, PDFPage, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { AccountQR, ContactQR, MnemonicQR, QRCode } from "symbol-qr-library";
import encodedFont from "./resources/encodedFont";
import encodedBasePdf from "./resources/encodedBasePdf";

/**
 * Default generation hash
 */
const DEFAULT_GENERATION_HASH_SEED =
  "57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6";

/**
 * Printing constants
 */
const MNEMONIC_POSITION = {
  x: 184,
  y: 36,
};
const ADDRESS_POSITION = {
  x: 184,
  y: 90,
};
const MNEMONIC_QR_POSITION = {
  x: 264,
  y: 159,
  width: 99,
  height: 99,
};
const ADDRESS_QR_POSITION = {
  x: 418,
  y: 159,
  width: 99,
  height: 99,
};

/**
 * Abstraction for NetworkType sdk interface
 */
export type INetworkType = number;
/**
 * HD Account info interface
 */
export type IHDAccountInfo = {
  mnemonic: string;
  rootAccountPublicKey: string;
  rootAccountAddress: string;
};
/**
 * Account info interface
 */
export type IAccountInfo = {
  name: string;
  address: string;
  publicKey: string;
  privateKey: string;
};

/**
 * Symbol Paper wallet class
 */
class SymbolPaperWallet {
  public hdAccount: IHDAccountInfo;
  public accountInfos: IAccountInfo[];
  public network: INetworkType;
  public generationHashSeed: string;

  constructor(
    hdAccountInfo: IHDAccountInfo,
    accountInfos: IAccountInfo[],
    network: INetworkType,
    generationHashSeed: string = DEFAULT_GENERATION_HASH_SEED
  ) {
    this.hdAccount = hdAccountInfo;
    this.accountInfos = accountInfos;
    this.network = network;
    this.generationHashSeed = generationHashSeed;
  }

  /**
   * Exports as a PDF Uin8Array
   */
  async toPdf(): Promise<Uint8Array> {
    // Load teplate pdf document. It consists of 2 pages - mnemonic and account.
    const plainPdfFile = new Buffer(encodedBasePdf, "base64");
    let pdfDoc = await PDFDocument.load(plainPdfFile);
    const notoSansFontBytes = new Buffer(encodedFont, "base64");
    pdfDoc.registerFontkit(fontkit);
    const notoSansFont = await pdfDoc.embedFont(notoSansFontBytes);

    const templatePages = pdfDoc.getPages();
    const templateMnemonicPage = templatePages[0];
    const templateAccountPage = templatePages[1];

    // Clone the template account page depending on the account info count
    if (this.accountInfos?.length) {
      for (let index = 0; index < this.accountInfos.length - 1; index++) {
        pdfDoc.addPage(this.copyPage(templateAccountPage));
      }

      const pages = pdfDoc.getPages();

      // Fill the template account pages with data
      for (const index in this.accountInfos) {
        const accountPageIndex = 1 + Number(index);
        await this.writeAccountPage(this.accountInfos[index], pdfDoc, pages[accountPageIndex], notoSansFont);
      }
    }
    else {
      // If there is no account info remove the template account page from document
      pdfDoc.removePage(1);
    }

    // Fill the template mnemonic page with data
    await this.writeMnemonicPage(pdfDoc, templateMnemonicPage, notoSansFont);

    return pdfDoc.save();
  }

  /**
   * Writes the mnemonic page into the given pdfDoc
   * @param pdfDoc
   * @param font
   */
  private async writeMnemonicPage(
    pdfDoc: PDFDocument,
    page: PDFPage,
    font: PDFFont
  ): Promise<void> {
    await this.writeAddress(this.hdAccount.rootAccountAddress, page, font);

    const mnemonicWords = this.hdAccount.mnemonic.split(" ");
    const firstMnemonic = mnemonicWords.slice(
      0,
      Math.round(mnemonicWords.length / 2)
    );
    const secondMnemonic = mnemonicWords.slice(
      Math.round(mnemonicWords.length / 2),
      mnemonicWords.length
    );
    await this.writePrivateInfo(
      [firstMnemonic.join(" "), secondMnemonic.join(" ")],
      page,
      font
    );

    const plainMnemonicQR = new MnemonicQR(
      this.hdAccount.mnemonic,
      this.network,
      this.generationHashSeed
    );
    await this.writePrivateQR(plainMnemonicQR, pdfDoc, page);

    const contactQR = new ContactQR(
      "Root account",
      this.hdAccount.rootAccountPublicKey,
      this.network,
      this.generationHashSeed
    );
    await this.writePublicQR(contactQR, pdfDoc, page);
  }

  /**
   * Writes the account page into the given pdfDoc
   * @param account
   * @param pdfDoc
   */
  private async writeAccountPage(
    account: IAccountInfo,
    pdfDoc: PDFDocument,
    page: PDFPage,
    font: PDFFont
  ): Promise<void> {
    await this.writeAddress(account.address, page, font);
    await this.writePrivateInfo([account.privateKey], page, font);

    const accountQR = new AccountQR(
      account.privateKey,
      this.network,
      this.generationHashSeed
    );
    await this.writePrivateQR(accountQR, pdfDoc, page);

    const contactQR = new ContactQR(
      account.name,
      account.publicKey,
      this.network,
      this.generationHashSeed
    );
    await this.writePublicQR(contactQR, pdfDoc, page);
  }

  /**
   * Writes address into the given pdfDoc
   * @param address
   * @param page
   * @param font
   */
  private async writeAddress(
    address: string,
    page: PDFPage,
    font: PDFFont
  ): Promise<PDFPage> {
    page.drawText(address, {
      x: ADDRESS_POSITION.x,
      y: ADDRESS_POSITION.y,
      size: 12,
      font: font,
      color: rgb(82 / 256, 0, 198 / 256),
    });
    return page;
  }

  /**
   * Writes private info into the pdfDoc
   * @param privateLines
   * @param page
   * @param font
   */
  private async writePrivateInfo(
    privateLines: string[],
    page: PDFPage,
    font: PDFFont
  ): Promise<PDFPage> {
    for (let i = 0; i < privateLines.length; i++) {
      page.drawText(privateLines[i], {
        x: MNEMONIC_POSITION.x,
        y: MNEMONIC_POSITION.y - 16 * i,
        size: 9,
        font: font,
        color: rgb(82 / 256, 0, 198 / 256),
      });
    }
    return page;
  }

  /**
   * Writes the private QR (mnemonic or private key) into the given pdfDoc
   * @param qr
   * @param pdfDoc
   * @param page
   */
  private async writePrivateQR(
    qr: QRCode,
    pdfDoc: PDFDocument,
    page: PDFPage
  ): Promise<PDFPage> {
    const qrBase64 = await qr.toBase64().toPromise();
    const png = await pdfDoc.embedPng(qrBase64);

    page.drawImage(png, {
      x: MNEMONIC_QR_POSITION.x,
      y: MNEMONIC_QR_POSITION.y,
      width: MNEMONIC_QR_POSITION.width,
      height: MNEMONIC_QR_POSITION.height,
    });
    return page;
  }

  /**
   * Writes the public QR into the given pdfDoc
   * @param qr
   * @param pdfDoc
   * @param page
   */
  private async writePublicQR(
    qr: QRCode,
    pdfDoc: PDFDocument,
    page: PDFPage
  ): Promise<PDFPage> {
    const qrBase64 = await qr.toBase64().toPromise();
    const png = await pdfDoc.embedPng(qrBase64);

    page.drawImage(png, {
      x: ADDRESS_QR_POSITION.x,
      y: ADDRESS_QR_POSITION.y,
      width: ADDRESS_QR_POSITION.width,
      height: ADDRESS_QR_POSITION.height,
    });
    return page;
  }

  /**
   * Clones a PDF page
   * @param page
   */
  private copyPage(page: PDFPage): PDFPage {
    const clonedNode = page.node.clone();
    const { Contents } = page.node.normalizedEntries();

    if (Contents) {
      clonedNode.set(PDFName.of('Contents'), Contents.clone());
    }

    const clonedRef = page.doc.context.register(clonedNode);
    const clonedPage = PDFPage.of(clonedNode, clonedRef, page.doc);

    return clonedPage;
  };
}

export { SymbolPaperWallet };
