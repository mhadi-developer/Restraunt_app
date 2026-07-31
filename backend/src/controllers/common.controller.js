import prisma from "../../utils/prismaClient.js";
import {redis} from "../config/redisClient.js"

// *************************************************
export const getCategories = async (req, res) => {
  try {
    const cacheKey = 'categories';
    const cachedCategories = await redis.get(cacheKey);
   
    
    if (cachedCategories) {
      console.log('cache hit for categories fetching');
      
      return res.status(200).json({
        success:true,
        message: 'categories fetched successfully',
        fetchedCategoires:JSON.parse(cachedCategories)
      })
    }


    const fetchedCategoires = await prisma.category.findMany({
      include: {
        categoryImage: true,
      },
    });

    await redis.set(cacheKey, JSON.stringify(fetchedCategoires), {
      EX:300
    })

    console.log('Cache redis not hit ');

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
  const { search , limit} = req.query
  
  


  try {
    if (search) {
      // if search property is avalable
      const cacheKey = `menu:search:${search.toLowerCase()}`;
      const cachedfetchedSearchItems = await redis.get(cacheKey);

      if (cachedfetchedSearchItems) {
        console.log('cache hit for search items')
        return res.status(200).json({
          message: `item fetched for ${search}`,
          items: JSON.parse(cachedfetchedSearchItems),
          source:'cache'
        })
      }

      const fetchedSearchItems = await prisma.item.findMany({
        where: {
          OR: [
            {
              itemName: {
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
      console.log('cache missed for search items ');
      await redis.set(cacheKey,
        JSON.stringify(fetchedSearchItems),
        {
          EX:180
        }
      )
       
      

      return res.status(200).json({
        message: `items fetched for ${search}`,
        items: fetchedSearchItems,
      })
    }
    
    if (limit) {
   // if limit is avalable 
      const cacheKey = `menu:limit:${limit}`
      const cachedLimitFetchedItems = await redis.get(cacheKey);
      if (cachedLimitFetchedItems) {
        console.log('cache hit for menu items limits');
        return res.status(200).json({
          message: 'items fetched succesfully',
          items: JSON.parse(cachedLimitFetchedItems),
          source:'cache'
        })
        
      }
      const limitItems = await prisma.item.findMany({
        take: Number.parseInt(limit),
        include:{
          itemImages:true
        }
      });
  
      console.log('cache miss for items limit');
      await redis.set(cacheKey,
        JSON.stringify(limitItems), {
          EX:180
        }
      )
      

      return res.status(200).json({
        message: 'Items fetched successfully',
        items: limitItems,
        success: true
      })
    }



    const cacheKey = "menu";
    const cachedMenuItems = await redis.get(cacheKey);


    if (cachedMenuItems) {
      return res.status(200).json({
        message: 'Menu items successfully fetched',
        items: JSON.parse(cachedMenuItems),
        success: true,
        source:'cache'
      })
    }

        const fetchedMenuItems = await prisma.item.findMany({
            include: {
                itemImages:true
            }
        })
        
    await redis.set(cacheKey, 
      JSON.stringify(fetchedMenuItems), {
        EX:300
      }
    )

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
    const cacheKey = `menu:item:id:${itemId}`;

    const cachedMenuItemById = await redis.get(cacheKey);

    if (cachedMenuItemById) {
      return res.status(200).json({
        message: `item fecthed by ${id}`,
        item: JSON.parse(cachedMenuItemById),
        source:'cache'
      })
    }
     
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

        await redis.set(cacheKey,
          JSON.stringify(fetchedItemById), {
            EX:180
          }
        )

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