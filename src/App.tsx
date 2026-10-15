import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import RouteLoader from "./components/RouteLoader";
import ScrollToTop from "./components/ScrollToTop";
import MainLayout from "./layouts/MainLayout";
import ProfileHome from "./pages/ProfileHome";
import NotFound from "./pages/NotFound";
import { STUDIO_PATH, studioPath } from "./lib/routes";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const ProjectDetails = lazy(() => import("./pages/ProjectDetails"));
const Projects = lazy(() => import("./pages/Projects"));
const Services = lazy(() => import("./pages/Services"));

const StudioRedirect = ({ to }: { to?: string }) => {
  const { pathname, search, hash } = useLocation();
  return (
    <Navigate to={`${to ?? studioPath(pathname)}${search}${hash}`} replace />
  );
};

const App = () => (
  <BrowserRouter
    future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
  >
    <ScrollToTop />
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route path="/" element={<ProfileHome />} />
        <Route path={STUDIO_PATH} element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="about" element={<About />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="contact" element={<Contact />} />
          <Route
            path="work"
            element={<StudioRedirect to={studioPath("/projects")} />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="services" element={<StudioRedirect />} />
        <Route path="about" element={<StudioRedirect />} />
        <Route path="projects/*" element={<StudioRedirect />} />
        <Route path="contact" element={<StudioRedirect />} />
        <Route
          path="work"
          element={<StudioRedirect to={studioPath("/projects")} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
