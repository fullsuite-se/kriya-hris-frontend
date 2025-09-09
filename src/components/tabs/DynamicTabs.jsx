import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const DynamicTabs = ({ tabs = [], defaultValue }) => {
  if (!tabs.length) return null;
  return (
    <div className="flex flex-col gap-6 w-full h-full">
      <Tabs
        defaultValue={defaultValue || tabs[0].value}
        className="flex flex-col w-full h-full"
      >
        <div className="overflow-x-auto">
          {" "}
          <TabsList className="flex-nowrap min-w-max flex gap-2 p-2">
            {tabs.map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex-1 px-0 py-4 mx-3  rounded-none  !shadow-none data-[state=active]:border-b-[#008080]
 data-[state=active]:text-[#008080] text-[#00000099] hover:text-black data-[state=active]:bg-transparent  !bg-transparent cursor-pointer"
              >
                <span>{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="py-2"></div>

        {tabs.map(({ value, content }) => (
          <TabsContent
            key={value}
            value={value}
            className="w-full h-full flex-1"
          >
            {content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DynamicTabs;



//controlled ito
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// const DynamicTabs = ({ tabs = [], defaultValue, activeTab, onTabChange }) => {
//   if (!tabs.length) return null;

//   return (
//     <div className="flex flex-col gap-6 w-full h-full">
//       <Tabs
//         value={activeTab || defaultValue || tabs[0].value}
//         onValueChange={onTabChange}
//         className="flex flex-col w-full h-full"
//       >
//         <div className="overflow-x-auto">
//           <TabsList className="flex-nowrap min-w-max flex gap-2 p-2">
//             {tabs.map(({ value, label }) => (
//               <TabsTrigger
//                 key={value}
//                 value={value}
//                 className="flex-1 px-0 py-4 mx-3 rounded-none !shadow-none
//                   data-[state=active]:border-b-[#008080]
//                   data-[state=active]:text-[#008080]
//                   text-[#00000099] hover:text-black
//                   data-[state=active]:bg-transparent !bg-transparent
//                   cursor-pointer"
//               >
//                 <span>{label}</span>
//               </TabsTrigger>
//             ))}
//           </TabsList>
//         </div>

//         <div className="py-2"></div>

//         {tabs.map(({ value, content }) => (
//           <TabsContent
//             key={value}
//             value={value}
//             className="w-full h-full flex-1"
//           >
//             {content}
//           </TabsContent>
//         ))}
//       </Tabs>
//     </div>
//   );
// };

// export default DynamicTabs;
