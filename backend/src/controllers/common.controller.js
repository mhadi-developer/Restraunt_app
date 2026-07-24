import prisma from "../../utils/prismaClient.js";


// *************************************************
export const getCategories = async (req, res) => {
  try {
    const fetchedCategoires = await prisma.category.findMany({
      include: {
        categoryImage: true,
      },
    });

    return res.status(200).json({
      message: "Caegories fetched successfully",
      success: true,
      fetchedCategoires,
    });
  } catch (error) {
    console.error("🚨 CONTROLLER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// ********************************************************

export const getMenuItems = async (req, res) => {
  const { search } = req.query


  try {
    if (search) {
      const fetchedSearchItems = await prisma.item.findMany({
        where: {
          OR: [
            {
              itemName: {
                contains: search,
                mode: "insensitive",
              },
              itemDescription: {
                contains: search,
                mode: "insensitive",
              },
              categoryName: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
        include: {
          itemImages:true
        }
      });

      return res.status(200).json({
        message: `items fetched for ${search}`,
        items:fetchedSearchItems
      })
      }
        const fetchedMenuItems = await prisma.item.findMany({
            include: {
                itemImages:true
            }
        })

        return res.status(200).json({
            message:'Items fetched Sucessfully',
            items: fetchedMenuItems,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Server Errro",
           success: false 
        })
        
    }
}
// ****************************************************************

export const getMenuItemById = async (req, res) => {
  try {
    const {id} = req.params;
    console.log(id);
    
    const itemId = Number.parseInt(id);
    
    if (itemId) {
      const fetchedItemById = await prisma.item.findFirst({
        where: {
          id:itemId
        },
        include: {
          itemImages:true
        }
      });
      if (fetchedItemById) {
        return res.status(200).json({
          message: 'Item fetched successfully',
          item: fetchedItemById
        });
        } else {
        return res.status(404).json({
          message: 'Item not found',
        })
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Server Error",
      success: false
    })
    
    
  }
}