import {
  ChakraProvider,
  Box,
  Text,
  theme,
} from "@chakra-ui/react"
import * as React from "react"
import FilmList from "./components/film/FilmList"
import { createApolloClient } from "./apollo/createApolloClient"
import { ApolloProvider } from "@apollo/client"

const apolloClient = createApolloClient()

export const App = () => (
  <ApolloProvider client={apolloClient}>
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Text>Ghibli GraphQL</Text>
        <FilmList />
      </Box>
    </ChakraProvider>
  </ApolloProvider>
)
