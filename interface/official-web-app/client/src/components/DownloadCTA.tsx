import { Link } from "wouter";
import { LightAppStoreButtons } from "@/components/AppStoreButtons"; 

export default function DownloadCTA() {
  return (
    <section id="download" className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="font-bold text-3xl md:text-4xl text-white mb-4">
            Get Started with TiffinWale Today
          </h2>
          <p className="text-white opacity-90 max-w-2xl mx-auto mb-8">
            Download our app to browse menus, manage your subscription, and track deliveries.
          </p>
          
          <LightAppStoreButtons />
        </div>
      </div>
    </section>
  );
}
