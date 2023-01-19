"use strict";

/**
 * event controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::event.event", ({ strapi }) => ({
  // Create event with link user
  async create(ctx) {
    const { id } = ctx.state.user; //ctx.state.user contains the current authenticated user
    const response = await super.create(ctx);
    const updatedResponse = await strapi.entityService.update(
      "api::event.event",
      response.data.id,
      { data: { user: id } }
    );
    return updatedResponse;
  },

  // Update user event
  async update(ctx) {
    // ?console.log(ctx.request.body);
    // ?console.log(ctx.request.files);
    const [event] = await strapi.entityService.findMany("api::event.event", {
      filters: {
        id: ctx.request.params.id,
        user: ctx.state.user.id,
      },
    });

    if (event) {
      const response = await super.update(ctx);
      return response;
    } else {
      return ctx.unauthorized();
    }
  },

  // Delete User event
  async delete(ctx) {
    const [event] = await strapi.entityService.findMany("api::event.event", {
      filters: {
        id: ctx.request.params.id,
        user: ctx.state.user.id,
      },
    });
    if (event) {
      const response = await super.delete(ctx);
      return response;
    } else {
      return ctx.unauthorized();
    }
  },

  //Find with populate
  async find(ctx) {
    const populateList = ["image", "user"];
    // Push any additional query params to the array
    populateList.push(ctx.query.populate);
    ctx.query.populate = populateList.join(",");
    const content = await super.find(ctx);
    return content;
  },

  // Get Logged in users
  async me(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.badRequest(null, [
        { messages: [{ id: "No Authorization header was found!" }] },
      ]);
    }

    const data = await strapi.db.query("api::event.event").findMany({
      where: {
        user: { id: user.id },
      },
      populate: { user: true, image: true },
    });

    if (!data) {
      return ctx.notFound();
    }

    const res = await this.sanitizeOutput(data, ctx);
    return res;
  },
}));
