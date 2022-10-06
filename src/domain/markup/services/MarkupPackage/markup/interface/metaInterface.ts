/**
 * Пример
 * Тема:  (*Можно ли простить измену?*)
 * Класс: 11
 * Год: 2019
 * Предмет: русский язык
 * Тест: итоговое сочинение
 * Категория: базовый
 * Эксперт: Babroob
 * Время разметки:35 минут
 * Повторная проверка:15 минут
 */
export interface MetaInterface {
    name?: string,
    theme: string,
    class?: string | number,
    year: string | number,
    subject: string,
    test: string,
    category: string,
    expert?: string,
    timeMarkup?: string,
    timeSecondMarkup?: string,
}
