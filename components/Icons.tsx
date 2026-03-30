import React from 'react';

const createIcon = (path: React.ReactNode) => (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        {path}
    </svg>
);

export const AcneIcon = createIcon(<><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>);
export const OilDropIcon = createIcon(<path d="M12 22a7 7 0 0 0 7-7c0-3.9-3.1-7-7-7s-7 3.1-7 7a7 7 0 0 0 7 7z" />);
export const TextureIcon = createIcon(<><path d="M20 6 9 17l-5-5" /><path d="m20 12-5.5-5.5" /><path d="m6 6 3 3" /></>);
export const SparklesIcon = createIcon(<><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6-6A2 2 0 0 0 1.063 9.5l6 6a2 2 0 0 0 1.437 1.437l6 6a2 2 0 0 0 1.437-1.437Z" /><path d="M21 12a9 9 0 1 1-9-9" /><path d="M14.5 7.5 12 5l-2.5 2.5L7 10l2.5 2.5L12 15l2.5-2.5L17 10Z" /><path d="M2.204 15.556 3 15l.444-.204.204-.444.204-.444L3 14l-.852.412Z" /><path d="M15.5 2.204 15 3l-.204-.444-.444-.204L14 2l.412-.852.444-.204.444.204L15 3Z" /></>);
export const ZapIcon = createIcon(<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />);
export const HydrationIcon = createIcon(<><path d="M12 22a7 7 0 0 0 7-7c0-3.9-3.1-7-7-7s-7 3.1-7 7a7 7 0 0 0 7 7z" /><path d="M12 12v6" /><path d="M14 14h-4" /></>);
export const WindIcon = createIcon(<><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" /><path d="M9.6 4.6A2 2 0 1 1 11 8H2" /><path d="M12.6 19.4A2 2 0 1 0 14 16H2" /></>);
export const RednessIcon = createIcon(<><circle cx="12" cy="12" r="10" /><path d="m15.5 15.5-2.5-2.5-2.5 2.5" /><path d="m8.5 8.5 2.5 2.5 2.5-2.5" /><path d="m15.5 8.5-5 5" /><path d="m8.5 15.5 5-5" /></>);
export const ShieldCheckIcon = createIcon(<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></>);
export const FolderIcon = createIcon(<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L8.6 3.3A2 2 0 0 0 6.9 2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z" />);
export const HeartIcon = createIcon(<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />);
export const SunIcon = createIcon(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></>);
export const MinusIcon = createIcon(<path d="M5 12h14" />);
export const User = createIcon(<><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>);
export const CheckIcon = createIcon(<path d="M20 6 9 17l-5-5" />);
export const RefreshCw = createIcon(<><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></>);
export const X = createIcon(<><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>);
export const ArrowLeftIcon = createIcon(<><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></>);
export const ArrowRightIcon = createIcon(<><path d="M5 12h14" /><path d="m12 5 7 7-7-7" /></>);
export const MoonIcon = createIcon(<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />);
export const ShoppingCartIcon = createIcon(<><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.16" /></>);
export const BotMessageSquare = createIcon(<><path d="M12 6V5" /><path d="M8 6V5" /><path d="M16 6V5" /><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>);
export const SwitchCameraIcon = createIcon(<><path d="M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" /><path d="M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5" /><path d="m18 4-3 3 3 3" /><path d="m6 20 3-3-3-3" /></>);
export const FlashOnIcon = createIcon(<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />);
export const FlashOffIcon = createIcon(<><line x1="2" x2="22" y1="2" y2="22" /><path d="M17.27 17.27 13 22v-8H7l4.58-6.42" /><path d="M13 2 10.3 6.99" /></>);
export const MenuIcon = createIcon(<>
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
</>);
export const Plus = createIcon(<><path d="M5 12h14" /><path d="M12 5v14" /></>);
export const TrashIcon = createIcon(<><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>);
export const Download = createIcon(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></>);
export const UploadCloud = createIcon(<><path d="M16 16l-4-4-4 4" /><path d="M12 12v9" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /><path d="M16 16l-4-4-4 4" /></>);
export const CameraIcon = createIcon(<><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></>);
export const TriangleAlertIcon = createIcon(<><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>);
export const CheckCircle = createIcon(<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></>);
export const ChevronDownIcon = createIcon(<path d="m6 9 6 6 6-6" />);