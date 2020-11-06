import { LocalDate, LocalDateTime } from 'js-joda';

export const formatTransactionLocalDateTime = (dt: LocalDateTime): string => {
    return `${dt.dayOfMonth()}/${dt.monthValue()}/${dt.year()}`;
};
