import type {Ref} from "vue";
export const useMod = (): Ref<boolean> => {
    return useState('mod', () => false)
}