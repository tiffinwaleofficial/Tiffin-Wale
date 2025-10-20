import { ImageStrategy } from "../interfaces/seeder-phase.interface";

export class ImageUrlGenerator {
  constructor(private strategy: ImageStrategy) {}

  generateFoodImage(category: string, itemName?: string): string {
    switch (this.strategy.provider) {
      case "unsplash":
        return this.generateUnsplashUrl("food", category, itemName);
      case "picsum":
        return this.generatePicsumUrl();
      case "curated":
        return this.generateCuratedUrl("food", category);
      case "local":
        return this.generateLocalUrl("food", category);
      default:
        return this.generateUnsplashUrl("food", category, itemName);
    }
  }

  generateRestaurantImage(restaurantName?: string): string {
    switch (this.strategy.provider) {
      case "unsplash":
        return this.generateUnsplashUrl(
          "restaurant",
          "restaurant-interior",
          restaurantName,
        );
      case "picsum":
        return this.generatePicsumUrl();
      case "curated":
        return this.generateCuratedUrl("restaurant", "restaurant");
      case "local":
        return this.generateLocalUrl("restaurant", "restaurant");
      default:
        return this.generateUnsplashUrl(
          "restaurant",
          "restaurant-interior",
          restaurantName,
        );
    }
  }

  generateProfileImage(userName?: string): string {
    switch (this.strategy.provider) {
      case "unsplash":
        return this.generateUnsplashUrl(
          "profile",
          "professional-headshot",
          userName,
        );
      case "picsum":
        return this.generatePicsumUrl(400, 400);
      case "curated":
        return this.generateCuratedUrl("profile", "avatar");
      case "local":
        return this.generateLocalUrl("profile", "avatar");
      default:
        return this.generateUnsplashUrl(
          "profile",
          "professional-headshot",
          userName,
        );
    }
  }

  private generateUnsplashUrl(
    type: string,
    category: string,
    itemName?: string,
  ): string {
    const baseUrl =
      this.strategy.baseUrl || "https://source.unsplash.com/800x600/?";
    const categories =
      this.strategy.categories[type as keyof typeof this.strategy.categories] ||
      [];

    // Use specific category if provided, otherwise random from type
    const searchTerm = categories.includes(category)
      ? category
      : categories[0] || category;

    // Add item name for more specific results
    const query = itemName
      ? `${searchTerm},${itemName.toLowerCase().replace(/\s+/g, "-")}`
      : searchTerm;

    return `${baseUrl}${encodeURIComponent(query)}&sig=${Math.random().toString(36).substr(2, 9)}`;
  }

  private generatePicsumUrl(width: number = 800, height: number = 600): string {
    const id = Math.floor(Math.random() * 1000) + 1;
    return `https://picsum.photos/${width}/${height}?random=${id}`;
  }

  private generateCuratedUrl(type: string, category: string): string {
    // Curated list of high-quality food images
    const curatedImages = {
      food: {
        "indian-food": [
          "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=600&fit=crop",
        ],
        "chinese-food": [
          "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&h=600&fit=crop",
        ],
        "italian-food": [
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop",
        ],
        breakfast: [
          "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&h=600&fit=crop",
        ],
        lunch: [
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
        ],
        dinner: [
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop",
        ],
      },
      restaurant: {
        restaurant: [
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&h=600&fit=crop",
        ],
      },
      profile: {
        avatar: [
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
        ],
      },
    };

    const typeImages = curatedImages[type as keyof typeof curatedImages];
    if (typeImages && typeImages[category]) {
      const images = typeImages[category];
      return images[Math.floor(Math.random() * images.length)];
    }

    // Fallback to unsplash
    return this.generateUnsplashUrl(type, category);
  }

  private generateLocalUrl(type: string, category: string): string {
    // For local development - would point to local asset files
    return `/assets/images/${type}/${category}/${Math.floor(Math.random() * 10) + 1}.jpg`;
  }

  // Generate multiple images for galleries
  generateImageGallery(
    type: string,
    category: string,
    count: number = 3,
  ): string[] {
    const images: string[] = [];
    for (let i = 0; i < count; i++) {
      images.push(this.generateFoodImage(category));
    }
    return images;
  }

  // Generate image with specific dimensions
  generateImageWithDimensions(
    type: string,
    category: string,
    width: number,
    height: number,
    itemName?: string,
  ): string {
    if (this.strategy.provider === "picsum") {
      return this.generatePicsumUrl(width, height);
    }

    // For other providers, modify URL to include dimensions
    const baseUrl = this.generateFoodImage(category, itemName);
    if (baseUrl.includes("unsplash.com")) {
      return baseUrl.replace(/w=\d+&h=\d+/, `w=${width}&h=${height}`);
    }

    return baseUrl;
  }
}
