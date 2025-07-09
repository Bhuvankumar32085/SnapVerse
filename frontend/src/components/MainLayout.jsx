import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

function MainLayout() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-1/5 border-r shadow-sm">
        <Sidebar />
      </div>

      {/*Mobile Sidebar Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setDrawerOpen} direction="left">
        <DrawerContent className="w-3/4 h-full p-4">
          <Sidebar close={closeDrawer} />
        </DrawerContent>
      </Drawer>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/*  Move Hamburger Button inside here */}
        <div className="md:hidden p-4">
          <Button variant="outline" size="icon" onClick={openDrawer}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
