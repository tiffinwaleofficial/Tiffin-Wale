import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { MenuItem } from "./schemas/menu-item.schema";
import { Category } from "./schemas/category.schema";
import { Menu } from "./schemas/menu.schema";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(MenuItem.name) private readonly menuItemModel: Model<MenuItem>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(Menu.name) private readonly menuModel: Model<Menu>,
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
    // If images array is provided but imageUrl is not, use first image as imageUrl for backward compatibility
    const menuItemData: any = { ...createMenuItemDto };
    if (
      menuItemData.images &&
      menuItemData.images.length > 0 &&
      !menuItemData.imageUrl
    ) {
      menuItemData.imageUrl = menuItemData.images[0];
    }

    const newMenuItem = new this.menuItemModel(menuItemData);
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
    const menus = await this.menuModel
      .find({ restaurant: restaurantId })
      .populate("restaurant", "businessName")
      .exec();

    // Populate menu items for each menu
    const menusWithItems = await Promise.all(
      menus.map(async (menu) => {
        const items = await this.menuItemModel
          .find({ menu: menu._id, isAvailable: true })
          .exec();
        return {
          ...menu.toObject(),
          items,
        };
      }),
    );

    return menusWithItems;
  }

  // Menu Management Methods
  async createMenu(createMenuDto: CreateMenuDto): Promise<Menu> {
    const newMenu = new this.menuModel(createMenuDto);
    return newMenu.save();
  }

  async findAllMenus(restaurantId?: string): Promise<Menu[]> {
    let menus: Menu[];
    if (restaurantId) {
      menus = await this.menuModel.find({ restaurant: restaurantId }).exec();
    } else {
      menus = await this.menuModel.find().exec();
    }

    // Populate items for each menu, filtered by partner if restaurantId is provided
    const menusWithItems = await Promise.all(
      menus.map(async (menu) => {
        // Find items for this menu
        const itemsQuery: any = { menu: menu._id };

        // If we have restaurantId, ensure items belong to this partner
        // We need to find the partner's user ID from the restaurant ID
        if (restaurantId) {
          // Note: This assumes items have businessPartner set to user ID
          // We'll need to filter items by checking if they belong to this restaurant's partner
          // For now, just get items for this menu - the partner check should be done at controller level
        }

        const items = await this.menuItemModel.find(itemsQuery).exec();
        return {
          ...menu.toObject(),
          items,
        };
      }),
    );

    return menusWithItems as any;
  }

  async findMenuById(id: string): Promise<Menu> {
    const menu = await this.menuModel.findById(id).exec();
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return menu;
  }

  async updateMenu(id: string, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    if (Object.keys(updateMenuDto).length === 0) {
      throw new BadRequestException("Update data cannot be empty");
    }

    const updatedMenu = await this.menuModel
      .findByIdAndUpdate(id, updateMenuDto, { new: true })
      .exec();

    if (!updatedMenu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    return updatedMenu;
  }

  async deleteMenu(id: string, userId?: string): Promise<{ deleted: boolean }> {
    // Check if menu has items - optionally filter by user for partner isolation
    const itemQuery: any = { menu: id };
    if (userId) {
      // Only count items that belong to this partner
      itemQuery.businessPartner = userId;
    }

    const itemCount = await this.menuItemModel.countDocuments(itemQuery).exec();
    if (itemCount > 0) {
      throw new BadRequestException(
        `Cannot delete menu with ${itemCount} items. Please remove items first.`,
      );
    }

    const result = await this.menuModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    return { deleted: true };
  }

  async getMenuWithItems(menuId: string): Promise<any> {
    const menu = await this.menuModel.findById(menuId).exec();
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${menuId} not found`);
    }

    const items = await this.menuItemModel
      .find({ menu: menuId })
      .sort({ name: 1 })
      .exec();

    return {
      ...menu.toObject(),
      items,
    };
  }
}
