import { useQueryClient, useMutation } from "@tanstack/react-query";
import { MapPin, Plus, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { api } from "./api";
import { translations } from "./translations";
import { Card } from "./Card";
import { Input } from "./Input";
import { Button } from "./Button";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

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

// StoreForm component
export const StoreForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: '',
        address: '',
        longitude: '',
        latitude: '',
    });
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const marker = useRef<mapboxgl.Marker | null>(null);

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
            });
            setImage(null);
            setImagePreview(null);
            onSuccess();
        }
    });

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
                <Input
                    label={translations.phone}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
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