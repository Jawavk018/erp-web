import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from './state/store'
interface GlobalStateProps {
    children: ReactNode
}

const GlobalState: React.FC<GlobalStateProps> = ({ children }) => (
        <Provider store={store}>
            {children}
        </Provider>
)

export default GlobalState
