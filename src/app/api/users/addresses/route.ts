import { NextRequest, NextResponse } from "next/server";
import payload from "payload";

export async function PUT(req: NextRequest) {
  try {
    // Clone the request to read it multiple times if needed
    const reqClone = req.clone();
    
    // Parse request body
    const { userId, addresses, operation } = await req.json();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" }, 
        { status: 400 }
      );
    }
    
    // Authenticate the request - ensure the user is modifying their own data
    let user;
    try {
      // Extract the cookies for authentication
      const cookieHeader = req.headers.get('cookie');
      console.log("Cookie header:", cookieHeader);
      
      if (!cookieHeader) {
        console.log("No cookie header found");
        return NextResponse.json(
          { success: false, message: "Authentication failed - no cookies provided" }, 
          { status: 401 }
        );
      }
      
      // Create a payload-compatible request object
      const payloadReq = {
        headers: {
          cookie: cookieHeader,
        },
      };
      
      // Declare authenticatedUser at this scope so it's available throughout the function
      let authenticatedUser;
      
      // Use Payload's built-in auth to validate the user
      try {
        const authResult = await payload.auth({ req: payloadReq } as any);
        console.log("Auth result:", authResult?.user ? `User found: ${authResult.user.id}` : 'No user');
        
        if (!authResult?.user?.id) {
          console.log("Authentication failed - invalid or expired session");
          return NextResponse.json(
            { success: false, message: "Authentication failed - please log in again" }, 
            { status: 401 }
          );
        }
        
        // Set authenticated user
        authenticatedUser = authResult.user;
        console.log("Authenticated user ID:", authenticatedUser.id);
      } catch (authError) {
        console.error("Auth error:", authError);
        return NextResponse.json(
          { success: false, message: "Authentication error" }, 
          { status: 401 }
        );
      }
      
      // Get the authenticated user's ID
      const tokenUserId = authenticatedUser.id;
      
      // Verify that the token user matches the requested userId
      if (tokenUserId !== userId) {
        return NextResponse.json(
          { success: false, message: "You can only update your own addresses" }, 
          { status: 403 }
        );
      }
      
      // Get the full user data to ensure we have access to all fields
      const result = await payload.findByID({
        collection: 'users',
        id: userId,
        depth: 1,
      });
      
      user = result;
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Authentication failed" }, 
        { status: 401 }
      );
    }
    
    if (!user || user.id !== userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - You can only update your own addresses" }, 
        { status: 403 }
      );
    }
    
      try {
        // Make sure addresses is an array
        if (!Array.isArray(addresses)) {
          return NextResponse.json(
            { success: false, message: "Addresses must be an array" }, 
            { status: 400 }
          );
        }
        
        // Use the operation value we already parsed from the request body
        
        let updatedAddresses;
        
        // Get current user to access current addresses
        const currentUser = await payload.findByID({
          collection: 'users',
          id: userId,
        });
        
        const currentAddresses = currentUser.addresses || [];
        
        if (operation === 'add' && addresses.length === 1) {
          // Adding a single new address
          const newAddress = addresses[0];
          
          // If setting as default, update other addresses
          if (newAddress.isDefault) {
            updatedAddresses = currentAddresses.map(addr => ({
              ...addr,
              isDefault: false
            }));
          } else {
            updatedAddresses = [...currentAddresses];
          }
          
          // Add the new address
          updatedAddresses.push(newAddress);
        } else {
          // Full replacement of addresses
          updatedAddresses = addresses;
        }
        
        // Update the user with the addresses
        const updatedUser = await payload.update({
          collection: "users",
          id: userId,
          data: {
            addresses: updatedAddresses,
          },
        });      return NextResponse.json({
        success: true,
        message: "Addresses updated successfully",
        addresses: updatedUser.addresses,
      });
    } catch (updateError: any) {
      console.error("Error updating user addresses:", updateError);
      console.error("Error stack:", updateError.stack);
      return NextResponse.json(
        { 
          success: false, 
          message: updateError.message || "Failed to update addresses",
          error: JSON.stringify(updateError, Object.getOwnPropertyNames(updateError))
        }, 
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error updating addresses:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Something went wrong",
        error: JSON.stringify(error, Object.getOwnPropertyNames(error))
      }, 
      { status: 500 }
    );
  }
}
