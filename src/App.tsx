import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ListDetailPage } from './pages/ListDetailPage'
import { ItemEditPage } from './pages/ItemEditPage'

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/list/:id" element={<ListDetailPage />} />
            <Route path="/list/:id/item/:itemId" element={<ItemEditPage />} />
          </Routes>
        </Layout>
      </AppProvider>
    </HashRouter>
  )
}
