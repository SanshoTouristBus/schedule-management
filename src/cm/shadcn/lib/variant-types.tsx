export type importanceStr = 'primary' | 'secondary'
export type colorVariantStr = 'info' | 'success' | 'warning' | 'destructive' | 'disabled'

export type btnVariantStr = 'default' | 'outline' | 'ghost'

export type textTypeStr = 'heading' | 'label' | 'body' | 'small'
export type textColorStr =
  | 'black'
  | 'gray'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'destructive'
  | 'disabled'

export type otherColorVariantStr = 'red' | 'green' | 'blue' | 'purple' | 'orange' | 'pink' | 'gray' | 'black' | 'white'

export type badgeVariantStr = importanceStr | colorVariantStr | otherColorVariantStr
