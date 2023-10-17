export interface ContextOption {
    title: string
    action?: () => any | boolean;
    danger?: boolean
    disabled?: boolean
}