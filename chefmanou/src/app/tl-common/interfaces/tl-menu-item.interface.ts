export interface ITlMenuItem {
  label: string,
  icon: string,
  route?: string,
  subItems?: ITlMenuItem[]
}
