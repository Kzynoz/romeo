import AppRoutes from "./routes/AppRoutes";
import Header from "./layout/Header";
import Footer from "./layout/Footer";

function App() {
  return (
    <>
      <Header />

      <main className="container">
        <AppRoutes />
      </main>

      <Footer />
    </>
  );
}

export default App;
