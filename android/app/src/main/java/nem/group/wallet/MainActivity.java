package nem.group.wallet;

import android.os.Bundle;
import androidx.annotation.Nullable;

import com.reactnativenavigation.NavigationActivity;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends NavigationActivity {
  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    SplashScreen.show(this, true);
  }
}
