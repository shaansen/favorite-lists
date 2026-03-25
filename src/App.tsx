import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ListDetailPage } from './pages/ListDetailPage'
import { TodoPage } from './pages/TodoPage'

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/list/:id" element={<ListDetailPage />} />
            <Route path="/todos" element={<TodoPage />} />
          </Routes>
        </Layout>
      </AppProvider>
    </HashRouter>
  )
}
