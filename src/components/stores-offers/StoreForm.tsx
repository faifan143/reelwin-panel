import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { MapPin, Plus, X, Flag } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { api } from "./api";
import { translations } from "./translations";
import { Card } from "./Card";
import { Input } from "./Input";
import { Button } from "./Button";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { StoreCategory } from "./types";

// Replace with your Mapbox API key
const MAPBOX_API_KEY = 'pk.eyJ1IjoibW9ra3MiLCJhIjoiY20zdno3MXl1MHozNzJxcXp5bmdvbTllYyJ9.Ed_O6F-c2IZJE9DoCyPZ2Q';
mapboxgl.accessToken = MAPBOX_API_KEY;

const providenceTranslations = {
    ALEPPO: "حلب",
    IDLIB: "إدلب",
    LATAKIA: "اللاذقية",
    TARTOUS: "طرطوس",
    HOMS: "حمص",
    HAMA: "حماة",
    DAMASCUS: "دمشق",
    DARAA: "درعا",
    SUWAYDA: "السويداء",
    QUNEITRA: "القنيطرة",
    RAQQAH: "الرقة"
};

// StoreForm component with category support
export const StoreForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: '',
        address: '',
        longitude: '',
        latitude: '',
        categoryId: '', // Add category field
    });
    // Phone input state
    const [isPhoneDropdownOpen, setIsPhoneDropdownOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState({
        code: "SY",
        name: "سوريا",
        dialCode: "+963"
    });
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const marker = useRef<mapboxgl.Marker | null>(null);
    const phoneDropdownRef = useRef<HTMLDivElement>(null);

    // Fetch store categories
    const { data: categories } = useQuery<StoreCategory[]>({
        queryKey: ['store-categories'],
        queryFn: api.getStoreCategories
    });

    // Country list with Arabic names
    const countries = [
        { code: "SY", name: "سوريا", dialCode: "+963" },
        { code: "SA", name: "السعودية", dialCode: "+966" },
        { code: "AE", name: "الإمارات العربية المتحدة", dialCode: "+971" },
        { code: "QA", name: "قطر", dialCode: "+974" },
        { code: "KW", name: "الكويت", dialCode: "+965" },
        { code: "BH", name: "البحرين", dialCode: "+973" },
        { code: "OM", name: "عُمان", dialCode: "+968" },
        { code: "JO", name: "الأردن", dialCode: "+962" },
        { code: "LB", name: "لبنان", dialCode: "+961" },
        { code: "IQ", name: "العراق", dialCode: "+964" },
        { code: "PS", name: "فلسطين", dialCode: "+970" },
        { code: "YE", name: "اليمن", dialCode: "+967" },
        { code: "EG", name: "مصر", dialCode: "+20" },
        { code: "SD", name: "السودان", dialCode: "+249" },
        { code: "DZ", name: "الجزائر", dialCode: "+213" },
        { code: "MA", name: "المغرب", dialCode: "+212" },
        { code: "TN", name: "تونس", dialCode: "+216" },
        { code: "LY", name: "ليبيا", dialCode: "+218" },
        { code: "TR", name: "تركيا", dialCode: "+90" },
        { code: "DE", name: "ألمانيا", dialCode: "+49" },
        { code: "FR", name: "فرنسا", dialCode: "+33" },
        { code: "GB", name: "المملكة المتحدة", dialCode: "+44" },
        { code: "IT", name: "إيطاليا", dialCode: "+39" },
        { code: "ES", name: "إسبانيا", dialCode: "+34" },
        { code: "NL", name: "هولندا", dialCode: "+31" },
        { code: "CH", name: "سويسرا", dialCode: "+41" },
        { code: "SE", name: "السويد", dialCode: "+46" },
    ];

    const mutation = useMutation({
        mutationFn: api.createStore,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stores'] });
            setFormData({
                name: '',
                phone: '',
                city: '',
                address: '',
                longitude: '',
                latitude: '',
                categoryId: '', // Reset category
            });
            setImage(null);
            setImagePreview(null);
            // Reset phone related state
            setSelectedCountry({ code: "SY", name: "سوريا", dialCode: "+963" });
            setIsPhoneDropdownOpen(false);
            onSuccess();
        }
    });

    // Flag component for better browser compatibility
    const FlagIcon = ({ countryCode, className = "" }: { countryCode: string; className?: string }) => {
        // Special handling for Syrian revolution flag (green, white, black horizontal stripes with 3 red stars)
        if (countryCode === "SY") {
            return (
                <>
                    {/* CSS-based Syrian revolution flag fallback */}
                    <div className={`hidden inline-block ${className} relative overflow-hidden rounded-sm`}>
                        <div className="w-full h-1/3 bg-green-600"></div>
                        <div className="w-full h-1/3 bg-white relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex space-x-0.5">
                                    <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                                    <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                                    <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-1/3 bg-black"></div>
                    </div>
                </>
            );
        }

        return (
            <>
                <img
                    src={`https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`}
                    alt={`${countryCode} flag`}
                    className={`inline-block ${className}`}
                    onError={(e) => {
                        // Fallback to Flag icon if image fails to load
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) {
                            fallback.classList.remove('hidden');
                        }
                    }}
                />
                <Flag className="w-4 h-4 text-gray-400 hidden" />
            </>
        );
    };

    // Handle country selection
    const handleCountrySelect = (country: { code: string; name: string; dialCode: string }) => {
        setSelectedCountry(country);
        setIsPhoneDropdownOpen(false);
        // Update phone field with new country code
        if (formData.phone) {
            // Keep the local part of the number but change the country code
            let localPart = formData.phone.replace(/^\+\d+/, "");
            // Remove leading zeros from local part
            localPart = localPart.replace(/^0+/, "");
            setFormData(prev => ({ ...prev, phone: country.dialCode + localPart }));
        } else {
            setFormData(prev => ({ ...prev, phone: country.dialCode }));
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow numbers and remove leading zeros
        let value = e.target.value.replace(/[^0-9]/g, "");
        // Remove leading zeros
        value = value.replace(/^0+/, "");
        setFormData(prev => ({ ...prev, phone: selectedCountry.dialCode + value }));
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (phoneDropdownRef.current && !(phoneDropdownRef.current as HTMLElement).contains(event.target as Node)) {
                setIsPhoneDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [phoneDropdownRef]);

    // Initialize map when component mounts
    useEffect(() => {
        if (map.current) return; // initialize map only once

        // Create map
        if (mapContainer.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [36.2765, 33.5138], // Default to Damascus, Syria
                zoom: 10
            });

            // Add navigation controls
            map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

            // Get user's current location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        if (map.current) {
                            const { longitude, latitude } = position.coords;
                            map.current.flyTo({
                                center: [longitude, latitude],
                                zoom: 14
                            });

                            // Set initial marker
                            const coordinates: [number, number] = [longitude, latitude];
                            setMarkerAndUpdate(coordinates);
                        }
                    },
                    (error) => {
                        console.error("Error getting location:", error);
                    }
                );
            }

            // Add click handler for map
            map.current.on('click', (e) => {
                const coordinates: [number, number] = [e.lngLat.lng, e.lngLat.lat];
                setMarkerAndUpdate(coordinates);
            });
        }
    }, []);

    // Function to set marker and update form data
    const setMarkerAndUpdate = (coordinates: [number, number]) => {
        if (!map.current) return;

        // Remove existing marker if any
        if (marker.current) {
            marker.current.remove();
        }

        // Add new marker
        marker.current = new mapboxgl.Marker({ color: "#4F46E5", draggable: true })
            .setLngLat(coordinates)
            .addTo(map.current);

        // Update form data with coordinates
        setFormData(prev => ({
            ...prev,
            longitude: coordinates[0].toString(),
            latitude: coordinates[1].toString()
        }));

        // Handle marker drag end
        marker.current.on('dragend', () => {
            if (marker.current) {
                const lngLat = marker.current.getLngLat();
                setFormData(prev => ({
                    ...prev,
                    longitude: lngLat.lng.toString(),
                    latitude: lngLat.lat.toString()
                }));
            }
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setImage(selectedFile);

            // Create image preview
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target?.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);

        // Reset the file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Update marker when coordinates are manually changed
        if (map.current && marker.current && formData.longitude && formData.latitude) {
            const lng = name === 'longitude' ? parseFloat(value) : parseFloat(formData.longitude);
            const lat = name === 'latitude' ? parseFloat(value) : parseFloat(formData.latitude);

            if (!isNaN(lng) && !isNaN(lat)) {
                marker.current.setLngLat([lng, lat]);
                map.current.flyTo({ center: [lng, lat] });
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitData = new FormData();
        for (const [key, value] of Object.entries(formData)) {
            submitData.append(key, value);
        }

        if (image) {
            submitData.append('image', image);
        }

        mutation.mutate(submitData);
    };

    return (
        <Card className="mb-6">
            <h3 className="text-lg font-medium mb-4 text-gray-800 text-right">
                {translations.addNewStore}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" dir="rtl">
                <Input
                    label={translations.storeName}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                {/* Store Category Dropdown */}
                <div className="w-full">
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1 text-right">
                        فئة المتجر
                    </label>
                    <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        dir="rtl"
                    >
                        <option value="">اختر فئة المتجر (اختياري)</option>
                        {categories?.filter(cat => cat.isActive).map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Phone Input with Country Code Selector */}
                <div className="w-full">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 text-right">
                        {translations.phone} <span className="text-red-500">*</span>
                    </label>
                    <div className="phone-input-rtl">
                        <div className="relative w-full" ref={phoneDropdownRef}>
                            {/* Main phone input container */}
                            <div className="border border-gray-300 rounded-lg overflow-hidden transition-all">
                                <div className="flex items-center h-12">
                                    {/* Country selector area */}
                                    <button
                                        type="button"
                                        className="flex items-center gap-1 px-3 py-3 border-r border-gray-300 h-full focus:outline-none hover:bg-gray-50 transition-colors"
                                        onClick={() => setIsPhoneDropdownOpen(!isPhoneDropdownOpen)}
                                    >
                                        <div className="flex items-center mr-2">
                                            <FlagIcon countryCode={selectedCountry.code} className="w-6 h-4" />
                                        </div>
                                        <span className="text-sm font-medium">{selectedCountry.code}</span>
                                        <svg className="h-4 w-4 text-gray-500 ml-2 transition-transform" style={{ transform: isPhoneDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Phone input field */}
                                    <div className="flex-grow">
                                        <input
                                            type="tel"
                                            value={formData.phone?.replace(selectedCountry.dialCode, "") || ""}
                                            onChange={handlePhoneChange}
                                            className="w-full h-full p-4 focus:outline-none text-base bg-transparent"
                                            dir="ltr"
                                            placeholder="مثال: 998419869"
                                            required
                                        />
                                    </div>

                                    {/* Country code display on the right */}
                                    <div className="px-4 text-base font-medium text-gray-600">
                                        {selectedCountry.dialCode}
                                    </div>
                                </div>
                            </div>

                            {/* Custom dropdown */}
                            {isPhoneDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                                    {countries.map((country) => (
                                        <div
                                            key={country.code}
                                            className={`flex items-center justify-between px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors ${selectedCountry.code === country.code ? 'bg-blue-100 text-blue-800' : 'text-gray-700'
                                                }`}
                                            onClick={() => handleCountrySelect(country)}
                                        >
                                            <div className="flex items-center gap-1">
                                                <div className="flex items-center mr-3">
                                                    <FlagIcon countryCode={country.code} className="w-6 h-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{country.name}</span>
                                                    <span className="text-sm text-gray-500">{country.dialCode}</span>
                                                </div>
                                            </div>
                                            <span className="text-sm font-mono text-gray-400">{country.code}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="w-full">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1 text-right">
                        {translations.city} <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                        dir="rtl"
                    >
                        <option value="" disabled>اختر المدينة</option>
                        {Object.entries(providenceTranslations).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
                <Input
                    label={translations.address}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                />

                {/* Map Container */}
                <div className="sm:col-span-2 md:col-span-3 mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                        {translations.location} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div ref={mapContainer} className="h-72 rounded-lg border border-gray-300" />
                        <div className="absolute top-2 left-2 bg-white p-2 rounded-lg shadow text-sm">
                            <p className="text-gray-700 flex items-center">
                                <MapPin className="w-4 h-4 mx-1 text-indigo-500" />
                                اضغط على الخريطة لتحديد الموقع
                            </p>
                        </div>
                    </div>
                </div>

                {/* Longitude and Latitude Inputs */}
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        label={translations.longitude}
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleCoordinateChange}
                        required
                    />
                    <Input
                        label={translations.latitude}
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleCoordinateChange}
                        required
                    />
                </div>

                <div className="sm:col-span-2 md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                        {translations.storeImage} <span className="text-red-500">*</span>
                    </label>

                    {imagePreview ? (
                        <div className="relative mb-4">
                            <div className="w-full h-48 rounded-lg border border-gray-300 overflow-hidden">
                                <img
                                    src={imagePreview}
                                    alt="Store preview"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none"
                                title="إزالة الصورة"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <p className="mt-2 text-sm text-gray-600 text-right">
                                {translations.selectedFile}: {image?.name}
                            </p>
                        </div>
                    ) : (
                        <div className="mt-1 flex justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                            <div className="space-y-1 text-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <div className="flex justify-center text-sm text-gray-600">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                    >
                                        <span>{translations.uploadFile}</span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            className="sr-only"
                                            onChange={handleImageChange}
                                            required
                                        />
                                    </label>
                                    <p className="pr-1">{translations.orDragDrop}</p>
                                </div>
                                <p className="text-xs text-gray-500">{translations.fileTypes}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="sm:col-span-2 md:col-span-3 mt-2 text-right">
                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                        icon={<Plus size={18} className="mx-1" />}
                    >
                        {mutation.isPending ? translations.adding : translations.addStore}
                    </Button>
                </div>
            </form>
            {mutation.isError && (
                <p className="text-red-500 mt-3 text-sm text-right">{translations.error}</p>
            )}
        </Card>
    );
};