import { DependencyList, EffectCallback, useEffect, useRef } from "react";

export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
    const firstRender = useRef(true);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        return effect();
    }, deps);
}
