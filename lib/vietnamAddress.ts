// Vietnam provinces/districts/wards data using public API
// API: https://provinces.open-api.vn/api/

export interface Ward {
  code: number;
  name: string;
  codename: string;
  division_type: string;
  short_codename: string;
}

export interface District {
  code: number;
  name: string;
  codename: string;
  division_type: string;
  short_codename: string;
  province_code: number;
  wards?: Ward[];
}

export interface Province {
  code: number;
  name: string;
  codename: string;
  division_type: string;
  phone_code: number;
  districts?: District[];
}

const API_BASE = 'https://provinces.open-api.vn/api';

export const fetchProvinces = async (): Promise<Province[]> => {
  try {
    const response = await fetch(`${API_BASE}/p/`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return [];
  }
};

export const fetchDistricts = async (provinceCode: number): Promise<District[]> => {
  try {
    const response = await fetch(`${API_BASE}/p/${provinceCode}?depth=2`);
    const data = await response.json();
    return data.districts || [];
  } catch (error) {
    console.error('Error fetching districts:', error);
    return [];
  }
};

export const fetchWards = async (districtCode: number): Promise<Ward[]> => {
  try {
    const response = await fetch(`${API_BASE}/d/${districtCode}?depth=2`);
    const data = await response.json();
    return data.wards || [];
  } catch (error) {
    console.error('Error fetching wards:', error);
    return [];
  }
};
