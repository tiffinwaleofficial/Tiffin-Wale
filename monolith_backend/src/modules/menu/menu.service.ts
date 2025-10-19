import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { MenuItem } from "./schemas/menu-item.schema";
import { Category } from "./schemas/category.schema";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(MenuItem.name) private readonly menuItemModel: Model<MenuItem>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    private readonly redisService: RedisService,
  ) {}

  async findAllMenuItems(): Promise<MenuItem[]> {
    return this.menuItemModel.find().exec();
  }

  async findMenuItemById(id: string): Promise<MenuItem> {
    const menuItem = await this.menuItemModel.findById(id).exec();
    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }
    return menuItem;
  }

  async createMenuItem(
    createMenuItemDto: CreateMenuItemDto,
  ): Promise<MenuItem> {
    const newMenuItem = new this.menuItemModel(createMenuItemDto);
    return newMenuItem.save();
  }

  async updateMenuItem(
    id: string,
    updateMenuItemDto: UpdateMenuItemDto,
  ): Promise<MenuItem> {
    if (Object.keys(updateMenuItemDto).length === 0) {
      throw new BadRequestException("Update data cannot be empty");
    }

    const updatedMenuItem = await this.menuItemModel
      .findByIdAndUpdate(id, updateMenuItemDto, { new: true })
      .exec();

    if (!updatedMenuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    return updatedMenuItem;
  }

  async deleteMenuItem(id: string): Promise<{ deleted: boolean }> {
    const result = await this.menuItemModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    return { deleted: true };
  }

  async findMenuItemsByPartner(partnerId: string): Promise<MenuItem[]> {
    try {
      // Check Redis cache first
      const cachedMenu = await this.redisService.getPartnerMenu(partnerId);
      if (cachedMenu) {
        return cachedMenu;
      }

      // Try to convert partnerId to ObjectId, if it's already a valid ObjectId
      const partnerObjectId = Types.ObjectId.isValid(partnerId)
        ? new Types.ObjectId(partnerId)
        : partnerId;

      // Use $in operator to match either string or ObjectId version
      const menuItems = await this.menuItemModel
        .find({
          businessPartner: { $in: [partnerObjectId, partnerId] },
        })
        .exec();

      // Cache the menu items in Redis
      if (menuItems.length > 0) {
        await this.redisService.cachePartnerMenu(
          partnerId,
          menuItems.map((item) => item.toObject()),
        );
      }

      return menuItems;
    } catch (error) {
      console.error(
        `Error finding menu items for partner ${partnerId}:`,
        error,
      );
      return []; // Return empty array instead of throwing to avoid breaking clients
    }
  }

  async findAllCategories(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const newCategory = new this.categoryModel(createCategoryDto);
    return newCategory.save();
  }

  async findCategoryById(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    if (Object.keys(updateCategoryDto).length === 0) {
      throw new BadRequestException("Update data cannot be empty");
    }

    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();

    if (!updatedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<{ deleted: boolean }> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return { deleted: true };
  }

  async getMenuItemDetails(itemId: string): Promise<MenuItem> {
    const menuItem = await this.menuItemModel
      .findById(itemId)
      .populate("category", "name description")
      .populate("businessPartner", "firstName lastName")
      .exec();

    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${itemId} not found`);
    }

    return menuItem;
  }

  async getRestaurantMenus(restaurantId: string): Promise<any[]> {
    // For now, return categories as menus since we don't have separate menu grouping yet
    // This can be enhanced later when Menu schema is fully integrated
    const categories = await this.categoryModel
      .find({ businessPartner: restaurantId })
      .populate("businessPartner", "businessName")
      .exec();

    return categories.map((category) => ({
      id: category._id,
      name: category.name,
      description: category.description,
      restaurant: restaurantId,
      images: [], // Categories don't have images in current schema
      isActive: category.isActive,
      items: [], // Will be populated separately if needed
    }));
  }
}
