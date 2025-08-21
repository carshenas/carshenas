import carshenasService from "@/services";

interface SliderItem {
    alt: string;
    action: string;
    image: string;
}

export const getSlider = () =>
    carshenasService.get<SliderItem[]>("/common/slider/");
