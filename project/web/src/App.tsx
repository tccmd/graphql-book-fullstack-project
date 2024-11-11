import { ChakraProvider, theme } from '@chakra-ui/react';
import { createApolloClient } from './apollo/createApolloClient';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Film from './pages/Film';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import User from './pages/User';

const apolloClient = createApolloClient();

export const App: React.FC = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/film/:filmId" element={<Film />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/user" element={<User />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </ApolloProvider>
  );
};
