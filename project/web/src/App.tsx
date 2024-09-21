import { ChakraProvider, theme } from "@chakra-ui/react"
import { createApolloClient } from "./apollo/createApolloClient"
import { ApolloProvider } from "@apollo/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Main from "./pages/Main"

const apolloClient = createApolloClient()

export const App: React.FC = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider theme={theme}>
        {/* <BrowserRouter>
            <Route exact path="/" component={FilmList} />
        </BrowserRouter> */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Main />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </ApolloProvider>
  )
}