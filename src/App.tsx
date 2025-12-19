import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocalNotifications } from "@capacitor/local-notifications";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const initLocalNotifications = async () => {
      try {
        // 1) İzin kontrolü
        const perm = await LocalNotifications.checkPermissions();

        // 2) Eğer izin yoksa iste
        if (perm.display !== "granted") {
          const request = await LocalNotifications.requestPermissions();

          if (request.display === "granted") {
            console.log("📌 Local Notification izni verildi");
          } else {
            console.log("❌ Kullanıcı bildirim izni vermedi");
          }
        } else {
          console.log("📌 Local Notification izni zaten verilmiş");
        }

        // 3) Listener (kullanıcı bildirime tıklayınca)
        LocalNotifications.addListener("localNotificationActionPerformed", (notification) => {
          console.log("📲 Kullanıcı bildirime tıkladı:", notification);
        });

      } catch (error) {
        console.error("Local Notification init hatası:", error);
      }
    };

    initLocalNotifications();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
