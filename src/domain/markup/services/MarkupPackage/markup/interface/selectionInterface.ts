/**parser.getJson()
 * (*   Коды   \   Фрагмент   \   Комментарий   :: Пояснение   >> Исправление   # Тег   *)
 */
export interface SelectionInterface {
    id: number,
    startSelection: number,
    endSelection: number,
    type: string,
    comment?: string,
    explanation: string,
    correction: string,
    tag: string,
    group: 'meaning' | 'error',
    subtype?: string
}
