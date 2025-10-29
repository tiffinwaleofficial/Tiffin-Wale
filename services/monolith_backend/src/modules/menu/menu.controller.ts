import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { MenuService } from "./menu.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/interfaces/user.interface";
import { GetCurrentUser } from "../../common/decorators/user.decorator";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { PartnerService } from "../partner/partner.service";

@ApiTags("menu")
@Controller("menu")
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    @Inject(forwardRef(() => PartnerService))
    private readonly partnerService: PartnerService,
  ) {}

  @Get("categories")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all categories" })
  @ApiResponse({ status: 200, description: "Return all categories" })
  findAllCategories() {
    return this.menuService.findAllCategories();
  }

  @Post("categories")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new category" })
  @ApiResponse({ status: 201, description: "Category created successfully" })
  @ApiResponse({ status: 400, description: "Invalid input" })
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.menuService.createCategory(createCategoryDto);
  }

  @Get("categories/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get category by ID" })
  @ApiResponse({ status: 200, description: "Return the category" })
  @ApiResponse({ status: 404, description: "Category not found" })
  findCategoryById(@Param("id") id: string) {
    return this.menuService.findCategoryById(id);
  }

  @Patch("categories/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a category" })
  @ApiResponse({ status: 200, description: "Category updated successfully" })
  @ApiResponse({ status: 404, description: "Category not found" })
  @ApiResponse({ status: 400, description: "Invalid input" })
  updateCategory(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.menuService.updateCategory(id, updateCategoryDto);
  }

  @Delete("categories/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a category" })
  @ApiResponse({ status: 200, description: "Category deleted successfully" })
  @ApiResponse({ status: 404, description: "Category not found" })
  deleteCategory(@Param("id") id: string) {
    return this.menuService.deleteCategory(id);
  }

  @Get("partner/:partnerId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get menu items by partner" })
  @ApiResponse({ status: 200, description: "Return partner menu items" })
  findMenuItemsByPartner(@Param("partnerId") partnerId: string) {
    return this.menuService.findMenuItemsByPartner(partnerId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all menu items" })
  @ApiResponse({ status: 200, description: "Return all menu items" })
  findAllMenuItems() {
    return this.menuService.findAllMenuItems();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new menu item for current partner" })
  @ApiResponse({ status: 201, description: "Menu item created successfully" })
  @ApiResponse({ status: 400, description: "Invalid input" })
  async createMenuItem(
    @GetCurrentUser() user: any,
    @Body() createMenuItemDto: CreateMenuItemDto,
  ) {
    // Get partner ID from user
    const userId =
      user._id?.toString() || user.id?.toString() || (user as any).sub;
    if (!userId) {
      throw new NotFoundException("User ID not found in token");
    }
    const partner = await this.partnerService.findByUserId(userId);

    // Set businessPartner from partner's user ID
    const menuItemData = {
      ...createMenuItemDto,
      businessPartner: partner.user.toString(),
    };

    return this.menuService.createMenuItem(menuItemData);
  }

  @Get("item/:itemId")
  @ApiOperation({ summary: "Get menu item details with reviews" })
  @ApiResponse({ status: 200, description: "Return menu item details" })
  @ApiResponse({ status: 404, description: "Menu item not found" })
  getMenuItemDetails(@Param("itemId") itemId: string) {
    return this.menuService.getMenuItemDetails(itemId);
  }

  @Get("restaurant/:restaurantId/menus")
  @ApiOperation({ summary: "Get all menus for a restaurant" })
  @ApiResponse({ status: 200, description: "Return restaurant menus" })
  getRestaurantMenus(@Param("restaurantId") restaurantId: string) {
    return this.menuService.getRestaurantMenus(restaurantId);
  }

  // Menu Management Endpoints
  @Post("menus")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new menu for current partner" })
  @ApiResponse({ status: 201, description: "Menu created successfully" })
  @ApiResponse({ status: 400, description: "Invalid input" })
  async createMenu(@GetCurrentUser() user: any, @Body() createMenuDto: any) {
    // Get partner ID from user
    const userId =
      user._id?.toString() || user.id?.toString() || (user as any).sub;
    if (!userId) {
      throw new NotFoundException("User ID not found in token");
    }
    const partner = await this.partnerService.findByUserId(userId);
    const menuData = {
      ...createMenuDto,
      restaurant: partner._id.toString(),
    };
    return this.menuService.createMenu(menuData);
  }

  @Get("menus")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all menus for current partner with items" })
  @ApiResponse({ status: 200, description: "Return partner menus with items" })
  async getMyMenus(@GetCurrentUser() user: any) {
    const userId =
      user._id?.toString() || user.id?.toString() || (user as any).sub;
    if (!userId) {
      throw new NotFoundException("User ID not found in token");
    }
    const partner = await this.partnerService.findByUserId(userId);

    // Get menus for this partner
    const menus = await this.menuService.findAllMenus(partner._id.toString());

    // Filter items to ensure they belong to this partner's user (for security)
    // Only include items where businessPartner matches the partner's user ID
    const filteredMenus = menus.map((menu: any) => ({
      ...menu,
      items:
        menu.items?.filter((item: any) => {
          const itemPartnerId =
            item.businessPartner?.toString() || item.businessPartner;
          return itemPartnerId === userId.toString();
        }) || [],
    }));

    return filteredMenus;
  }

  @Get("menus/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get menu by ID with items (partner only)" })
  @ApiResponse({ status: 200, description: "Return menu with items" })
  @ApiResponse({ status: 404, description: "Menu not found" })
  async getMenuWithItems(@GetCurrentUser() user: any, @Param("id") id: string) {
    const userId =
      user._id?.toString() || user.id?.toString() || (user as any).sub;
    if (!userId) {
      throw new NotFoundException("User ID not found in token");
    }

    // Verify menu belongs to current partner
    const partner = await this.partnerService.findByUserId(userId);
    const menu = await this.menuService.getMenuWithItems(id);

    if (menu.restaurant?.toString() !== partner._id.toString()) {
      throw new NotFoundException(
        "Menu not found or you don't have access to it",
      );
    }

    // Filter items to ensure they belong to this partner
    const filteredMenu = {
      ...menu,
      items:
        menu.items?.filter((item: any) => {
          const itemPartnerId =
            item.businessPartner?.toString() || item.businessPartner;
          return itemPartnerId === userId.toString();
        }) || [],
    };

    return filteredMenu;
  }

  @Patch("menus/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a menu" })
  @ApiResponse({ status: 200, description: "Menu updated successfully" })
  @ApiResponse({ status: 404, description: "Menu not found" })
  async updateMenu(
    @GetCurrentUser() user: any,
    @Param("id") id: string,
    @Body() updateMenuDto: any,
  ) {
    const userId =
      user._id?.toString() || user.id?.toString() || (user as any).sub;
    if (!userId) {
      throw new NotFoundException("User ID not found in token");
    }

    // Verify menu belongs to current partner
    const partner = await this.partnerService.findByUserId(userId);
    const menu = await this.menuService.findMenuById(id);

    if (menu.restaurant?.toString() !== partner._id.toString()) {
      throw new NotFoundException(
        "Menu not found or you don't have access to it",
      );
    }

    return this.menuService.updateMenu(id, updateMenuDto);
  }

  @Delete("menus/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a menu" })
  @ApiResponse({ status: 200, description: "Menu deleted successfully" })
  @ApiResponse({ status: 404, description: "Menu not found" })
  async deleteMenu(@GetCurrentUser() user: any, @Param("id") id: string) {
    const userId =
      user._id?.toString() || user.id?.toString() || (user as any).sub;
    if (!userId) {
      throw new NotFoundException("User ID not found in token");
    }

    // Verify menu belongs to current partner
    const partner = await this.partnerService.findByUserId(userId);
    const menu = await this.menuService.findMenuById(id);

    if (menu.restaurant?.toString() !== partner._id.toString()) {
      throw new NotFoundException(
        "Menu not found or you don't have access to it",
      );
    }

    return this.menuService.deleteMenu(id, userId);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get menu item by ID" })
  @ApiResponse({ status: 200, description: "Return the menu item" })
  @ApiResponse({ status: 404, description: "Menu item not found" })
  findMenuItemById(@Param("id") id: string) {
    return this.menuService.findMenuItemById(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a menu item" })
  @ApiResponse({ status: 200, description: "Menu item updated successfully" })
  @ApiResponse({ status: 404, description: "Menu item not found" })
  @ApiResponse({ status: 400, description: "Invalid input" })
  updateMenuItem(
    @Param("id") id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return this.menuService.updateMenuItem(id, updateMenuItemDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a menu item" })
  @ApiResponse({ status: 200, description: "Menu item deleted successfully" })
  @ApiResponse({ status: 404, description: "Menu item not found" })
  deleteMenuItem(@Param("id") id: string) {
    return this.menuService.deleteMenuItem(id);
  }
}
