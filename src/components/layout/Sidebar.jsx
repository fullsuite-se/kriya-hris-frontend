import React, { useContext, useEffect, useState } from "react";
import { useLocation, Link, matchPath } from "react-router-dom";

import {
  ConfigurationsIcon,
  ConfigurationsOutlineIcon,
} from "../../assets/icons/ConfigurationsIcon";
import EmployeesIcon, {
  EmployeesOutlineIcon,
} from "../../assets/icons/EmployeesIcon";
import LogoutIcon from "../../assets/icons/LogoutIcon";
import CloseIcon from "../../assets/icons/CloseIcon";
import ArrowHeadDownIcon, {
  ArrowHeadUpIcon,
} from "../../assets/icons/ArrowHeadIcon";

import DashboardIcon, {
  DashboardOutlineIcon,
} from "../../assets/icons/DashboardIcon";
import DrawerToggle from "@/components/layout/DrawerToggle";
import ArrowLeftLineIcon, {
  ArrowRightLineIcon,
} from "@/assets/icons/ArrowToLineIcon";
import { useAuthStore } from "@/stores/useAuthStore";
import { UserContext } from "@/context/UserContext";
import BuildingIcon, { BuildingOutlineIcon } from "@/assets/icons/BuildingIcon";
import UserGroupIcon, {
  UserGroupOutlineIcon,
} from "@/assets/icons/UserGroupIcon";

const sidebarLinks = [
  {
    service: "HRIS",
    tabs: [
      {
        feature: "HRIS Dashboard",
        label: "Dashboard",
        path: "/hris",
        icon: <DashboardOutlineIcon className="group-hover:text-[#008080]" />,
        iconActive: <DashboardIcon className="text-[#008080]" />,
      },
      {
        feature: "Employee Management",
        label: "Employees",
        path: "/hris/employees",
        activePaths: [
          "/hris/employees",
          "/hris/employees/add",
          "/hris/employees/:employee_id",
        ],
        icon: <EmployeesOutlineIcon className="group-hover:text-[#008080]" />,
        iconActive: <EmployeesIcon className="text-[#008080]" />,
      },
      {
        feature: "HRIS Configurations",
        label: "Configurations",
        path: "/hris/configurations",
        icon: (
          <ConfigurationsOutlineIcon className="group-hover:text-[#008080]" />
        ),
        iconActive: <ConfigurationsIcon className="text-[#008080]" />,
      },
      {
        feature: "Company Info",
        label: "About Company",
        path: "/hris/company",
        activePaths: ["/hris/company"],
        icon: <BuildingOutlineIcon className="group-hover:text-[#008080]" />,
        iconActive: <BuildingIcon className="text-[#008080]" />,
      },

      {
        feature: "Access Control",
        label: "Access Control",
        path: "/hris/access-control",
        icon: <UserGroupOutlineIcon className="group-hover:text-[#008080]" />,
        iconActive: <UserGroupIcon className="text-[#008080]" />,
      },
    ],
  },
  {
    service: "ATS",
    tabs: [
      {
        feature: "ATS Dashboard",
        label: "Dashboard",
        path: "/ats",
        icon: <DashboardOutlineIcon className="group-hover:text-[#008080]" />,
        iconActive: <DashboardIcon className="text-[#008080]" />,
      },
      {
        feature: "ATS Configurations",
        label: "Configurations",
        path: "/ats/applicants",
        icon: (
          <ConfigurationsOutlineIcon className="group-hover:text-[#008080]" />
        ),
        iconActive: <ConfigurationsIcon className="text-[#008080]" />,
      },
    ],
  },
];

const Sidebar = () => {
  const { personalInfo, user, designations } = useContext(UserContext);
  const { servicePermissions, accessPermissions } = useAuthStore();
  const allowedServices = servicePermissions.map((s) => s.toLowerCase());
  const allowedFeatures = accessPermissions.map((f) => f.toLowerCase());

  const [openIndexes, setOpenIndexes] = useState(
    sidebarLinks.map((_, idx) => idx)
  ); // open lahat initially
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  //   const user = true;

  const handleAccordionClick = (idx) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleDrawerToggle = () => setDrawerOpen((prev) => !prev);
  const handleDrawerClose = () => setDrawerOpen(false);

  const filteredSections = sidebarLinks.filter((section) => {
    const isServiceAllowed = allowedServices.includes(
      section.service.toLowerCase()
    );

    if (!isServiceAllowed) return false;

    const hasAtLeastOneAllowedFeature = section.tabs.some((tab) =>
      allowedFeatures.includes(tab.feature?.toLowerCase())
    );

    return hasAtLeastOneAllowedFeature;
  });

  return (
    <>
      {/* menu icon sa mobile */}
      <DrawerToggle onClick={handleDrawerToggle} />

      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 sm:hidden"
          onClick={handleDrawerClose}
        />
      )}

      {/* mismong Sidebar - pinakaparent */}
      <div
        className={`
          fixed top-0 left-0 h-full z-50 bg-white transition-transform duration-300
          ${drawerOpen ? "translate-x-0" : "-translate-x-full"}
          sm:static sm:translate-x-0 sm:flex
          ${collapsed ? "w-20 sm:w-20" : "w-60 sm:w-60"}
          p-4 flex flex-col sm:h-screen
        `}
        style={{
          boxShadow: drawerOpen ? "0 0 0 9999px rgba(0,0,0,0.0)" : undefined,
        }}
        onClick={(e) => e.stopPropagation()} // para 'di magsara pag nag click sa loob
      >
        {/* Collapse button - only sa desktop */}
        <div
          className={`${
            collapsed ? "self-center" : "self-end"
          } cursor-pointer hidden sm:block mb-6`}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ArrowRightLineIcon className="text-[#008080]" />
          ) : (
            <ArrowLeftLineIcon className="text-[#008080]" />
          )}
        </div>

        <div
          className={`${
            collapsed ? "self-center" : "self-end"
          } mb-2 block sm:hidden cursor-pointer`}
          onClick={handleDrawerToggle}
        >
          <CloseIcon className="text-[#008080]" />
        </div>

        {/* User Profile */}
        <div
          className={`flex items-center mb-10  ${collapsed && "self-center"}`}
        >
          <div
            className={`${
              collapsed ? "mt-1.5" : "h-11 w-11"
            } h-11 w-11 rounded-full border-1 border-gray-300 overflow-hidden flex items-center justify-center bg-primary-color flex-shrink-0`}
          >
            {personalInfo?.user_pic ? (
              <img
                src={personalInfo.user_pic}
                alt="User Profile"
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              <span className="text-sm font-bold text-white">
                {personalInfo?.first_name?.[0]?.toUpperCase()}
                {personalInfo?.last_name?.[0]?.toUpperCase()}
              </span>
            )}
          </div>

          {!collapsed && personalInfo && (
            <div className="overflow-hidden ml-3">
              <h3 className="font-medium text-gray-900 truncate text-medium">
                {personalInfo?.first_name} {personalInfo?.last_name}
              </h3>
              <p className="text-[#008080] truncate text-xs ">
                {designations?.CompanyJobTitle?.job_title}
              </p>
              <p className="text-gray-400 truncate !text-[10px]  ">
                {user.user_email}
              </p>
            </div>
          )}
        </div>
        {collapsed && <div className="pb-1.5"></div>}
        {/* Sidebar Menu Items */}

        <div className="flex-1 flex flex-col gap-2">
          {filteredSections.map((section, idx) => {
            const isOpen = openIndexes.includes(idx);

            return (
              <div key={section.service} className="text-gray-500 !text-sm">
                {/* Section service header - accordion */}
                <div
                  className={`cursor-pointer py-2 flex items-center gap-2 ${
                    collapsed ? "justify-center" : "justify-between"
                  } w-full select-none`}
                  onClick={() => handleAccordionClick(idx)}
                >
                  <span className="font-semibold">{section.service}</span>
                  <span className={collapsed ? "" : "mr-2"}>
                    {isOpen ? (
                      <ArrowHeadUpIcon className={`!text-gray-500`} />
                    ) : (
                      <ArrowHeadDownIcon className={`text-gray-500`} />
                    )}
                  </span>
                </div>

                {/* content tabs by service */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out transform ${
                    isOpen ? "max-h-96 translate-y-0" : "max-h-0 -translate-y-2"
                  } ${collapsed ? "pl-0" : "pl-5"}`}
                >
                  <div className="py-1">
                    {section.tabs
                      .filter((tab) =>
                        allowedFeatures.includes(tab.feature.toLowerCase())
                      )
                      .map((feature) => {
                        const isActive = feature.activePaths
                          ? feature.activePaths.some((path) =>
                              matchPath(path, location.pathname)
                            )
                          : location.pathname === feature.path;

                        return (
                          <Link
                            to={feature.path}
                            key={feature.label}
                            className={`flex items-center gap-2 my-6 cursor-pointer group ${
                              //changed from my-2 to my-6 for gap verticlly
                              collapsed ? "justify-center" : ""
                            }`}
                            onClick={handleDrawerClose} // sa mobile, close drawer after click
                          >
                            <span>
                              {isActive ? feature.iconActive : feature.icon}
                            </span>
                            {!collapsed && (
                              <span
                                className={`${
                                  isActive
                                    ? "font-bold text-[#008080]"
                                    : "font-normal group-hover:text-[#008080]"
                                }`}
                              >
                                {feature.label}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Link
          to="/logout"
          className={`flex flex-row items-center gap-2 group ${
            collapsed ? "justify-center" : "justify-end"
          } mt-auto mb-auto`}
        >
          {!collapsed && (
            <span className="text-gray-500 text-xs group-hover:text-[#008080]">
              LOGOUT
            </span>
          )}
          <LogoutIcon className="group-hover:text-[#008080] text-muted-foreground" />
        </Link>
      </div>
    </>
  );
};

export default Sidebar;
