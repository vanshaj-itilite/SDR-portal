import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SDRProvider } from "./context/SDRContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Accounts from "./pages/Accounts";
import Tasks from "./pages/Tasks";
import Analytics from "./pages/Analytics";
import Team from "./pages/Team";
import Campaigns from "./pages/Campaigns";
import CampaignDetail from "./pages/CampaignDetail";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <SDRProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"         element={<Dashboard />} />
            <Route path="leads"             element={<Leads />} />
            <Route path="accounts"          element={<Accounts />} />
            <Route path="tasks"             element={<Tasks />} />
            <Route path="analytics"         element={<Analytics />} />
            <Route path="campaigns"         element={<Campaigns />} />
            <Route path="campaigns/:id"     element={<CampaignDetail />} />
            <Route path="team"              element={<Team />} />
            <Route path="*"                 element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SDRProvider>
  );
}
