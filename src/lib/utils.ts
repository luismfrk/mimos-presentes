import type { CartItem,Product } from '../types'
export const money=(value:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value)
export const slugify=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
export function whatsappLink(message:string,base:string){const join=base.includes('?')?'&':'?';return `${base}${join}text=${encodeURIComponent(message)}`}
export const productMessage=(p:Product,personalization='')=>`Olá! 💕 Quero esse mimo:\n\n🎁 ${p.name}\n💰 ${money(p.price)}${personalization?`\n✨ Personalização: ${personalization}`:''}\n🔗 ${window.location.href}`
export const orderMessage=(items:CartItem[])=>{const total=items.reduce((s,i)=>s+i.product.price*i.quantity,0);return `Olá! 💕 Gostaria de pedir estes mimos:\n\n${items.map(i=>`🎁 ${i.product.name}\nQuantidade: ${i.quantity}${i.personalization?`\nPersonalização: ${i.personalization}`:''}\nSubtotal: ${money(i.product.price*i.quantity)}`).join('\n\n')}\n\n💝 Total: ${money(total)}`}
