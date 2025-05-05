import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { MenuService } from "./menu.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@ApiTags("menu")
@Controller("menu")
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new menu item" })
  @ApiResponse({ status: 201, description: "Menu item created successfully" })
  @ApiResponse({ status: 400, description: "Invalid input" })
  createMenuItem(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuService.createMenuItem(createMenuItemDto);
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
