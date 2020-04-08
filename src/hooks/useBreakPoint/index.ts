import { useLayoutEffect, useState } from 'react'

export const useBreakpoint = (breakpoint: string) => {
    const [match, setMatch] = useState(true)
    useLayoutEffect(() => {
        const query = `(min-width: ${breakpoint})`
        const mql = window.matchMedia(query)
        setMatch(mql.matches)
        const updateMatch = () => setMatch(mql.matches)

        mql.addEventListener('change', updateMatch)
        return () => {
            mql.removeEventListener('change', updateMatch)
        }

    }, [breakpoint])
    return match;
}
