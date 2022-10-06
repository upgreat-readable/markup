export interface IBaseBtnProps {
    children: string;
    modifierClass?: string;
    color?: 'orange' | 'blue' | 'white';
    size?: 'lg' | 'sm';
    href?: string;
    newTab?: true;
    handleClick?: any;
    submit?: true;
    download?: boolean;
    loading?: boolean;
    disabled?: boolean;
}
