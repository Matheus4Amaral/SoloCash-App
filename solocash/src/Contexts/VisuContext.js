import { createContext, useContext, useEffect, useState } from 'react'

const VisuContext = createContext()

export function VisuProvider({children}) {

    const [ showInfos, setShowInfos] = useState(true);

    return(
        <VisuContext.Provider
        value={{
            showInfos,
            setShowInfos
        }}
        >
            {children}
        </VisuContext.Provider>
    )

}

export const useVisu = () => useContext(VisuContext)