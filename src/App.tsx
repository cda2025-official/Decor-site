import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Index from "./pages/Index"
import Admin from "./pages/Admin"
import NotFound from "./pages/NotFound"
import "./App.css"
import SmoothScroll from "./Smooth"
import LoadingScreen from "./components/loading-component (1)"

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const handleScrollCallback = (lenis) => {
  // You can access scroll progress, velocity, etc.
  console.log("Scroll position:", lenis.scroll)
}

function App() {
  return (
    <LoadingScreen duration={2000}>
      <SmoothScroll
        lerp={0.07} // Slightly smoother than default
        smoothWheel={true}
        smoothTouch={true} // Enable for mobile
        wheelMultiplier={1.2} // Slightly faster scrolling
        touchMultiplier={1.5} // Better response on touch devices
        onScroll={handleScrollCallback}
      >
        <QueryClientProvider client={queryClient}>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </QueryClientProvider>
      </SmoothScroll>
    </LoadingScreen>
  )
}

export default App

