/**
 * ARZ - Afet Raporlama ve Zamanlama Types
 */

export type UserRole = 
  | 'citizen' 
  | 'health_personnel' 
  | 'afad_operator' 
  | 'logistics_manager' 
  | 'volunteer' 
  | 'researcher' 
  | 'admin';

export enum VolunteerStatus {
  IDLE = 'idle',
  ON_DUTY = 'on_duty',
  BREAK = 'break',
  INACTIVE = 'inactive'
}

export type VolunteerSkill = 'first_aid' | 'debris_removal' | 'psychology' | 'translation' | 'logistics' | 'search_rescue';

export interface Volunteer {
  id: string;
  name: string;
  skills: VolunteerSkill[];
  certificates: string[];
  status: VolunteerStatus;
  currentLocation?: { lat: number; lng: number };
  assignedTaskId?: string;
}

export interface HealthLog {
  id: string;
  region: string;
  feverCount: number;
  diarrheaCount: number;
  epidemicRisk: number; // 0-100
  timestamp: number;
}

export type ThemeType = 'corporate' | 'night' | 'clinical' | 'kizilay' | 'afad' | 'yesilay' | 'emergency112' | 'akut';

export type TextSize = 'small' | 'standard' | 'large' | 'xlarge' ;
export type FontFamily = 'inter' | 'roboto' | 'public-sans' | 'open-dyslexic';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: number;
  read: boolean;
  link?: string;
}

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  content: string;
  vehicleType: string;
  departureTime: number;
  status: 'preparing' | 'on_way' | 'delivered' | 'delayed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface UserPreferences {
  sidebarCollapsed: boolean;
  theme: ThemeType;
  textSize: TextSize;
  fontFamily: FontFamily;
  notificationsEnabled: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface ProjectIdentity {
  name: string;
  fullTitle: string;
  slogan: string;
  team: string;
  institution: string;
  department: string;
  advisor: string;
  leadDeveloper: string;
  version: string;
}

export interface Report {
  id: string;
  type: 'water' | 'food' | 'injured' | 'debris' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: { lat: number; lng: number; address: string };
  timestamp: number;
  description: string;
  reporterId: string;
}

export interface Patient {
  id: string;
  name?: string;
  age?: number;
  gender?: string;
  condition?: 'stable' | 'critical' | 'observation' | 'discharged';
  diagnosis?: string;
  admissionTime?: number;
  vitals?: {
    heartRate: number;
    bloodPressure: string;
    oxygenSaturation: number;
    temperature: number;
  };
  symptoms?: string[];
  allergies?: string[];
  triageColor?: 'red' | 'yellow' | 'green' | 'black';
  lastEvaluation?: number;
}

export interface LogisticsItem {
  id: string;
  category: 'food' | 'water' | 'medicine' | 'equipment' | 'shelter';
  quantity: number;
  unit: string;
  priority: number;
  status: 'pending' | 'shipped' | 'delivered';
}

export interface AIResponse {
  summary: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  analysis: string;
  priority: string;
  actions: string[];
  operationNote: string;
  clinicalNotes?: string;
}

export interface AISettings {
  active: boolean;
  localBrain: boolean;
  memory: boolean;
  roleBasedResponses: boolean;
  useMapData: boolean;
  useClinicalData: boolean;
  useLogisticsData: boolean;
  shortResponseMode: boolean;
  detailedAnalysisMode: boolean;
  showSecurityWarnings: boolean;
}

export interface DisplaySettings {
  boldText: boolean;
  largeText: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  bigButtons: boolean;
  focusRing: boolean;
  readableFont: boolean;
  colorBlindMode: string;
  brightness: number;
}

export interface ToastSettings {
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
  duration: number;
  showIcon: boolean;
  animation: 'slide' | 'fade' | 'bounce';
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export interface MapSettings {
  showMyLocation: boolean;
  showIncidentMarkers: boolean;
  showHelpPoints: boolean;
  trafficLayer: boolean;
  roadStatusLayer: boolean;
  heatmap: boolean;
  mapStyle: 'standard' | 'light' | 'satellite' | 'operation' | 'high_contrast';
  disasterType: 'general' | 'earthquake' | 'flood' | 'fire' | 'landslide' | 'avalanche' | 'storm' | 'drought' | 'epidemic' | 'logistics';
  brightness: number;
  contrast: number;
  markerDensity: 'low' | 'medium' | 'high';
  showLabels: boolean;
  activeLayers: string[];
}

export interface ProvinceData {
  id: string;
  name: string;
  region: string;
  activeDisasters: string[];
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  activeReportsCount: number;
  injuredCount: number;
  needsHelp: boolean;
  roadStatus: string;
  weather: string;
  logisticsPriority: string;
  aiSuggestion: string;
  coords: [number, number];
}
