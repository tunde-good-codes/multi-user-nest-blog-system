import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import type { PaginationQueryDto } from "src/common/pagination/dtos/pagination-query.dto";
import type { ObjectLiteral, Repository } from "typeorm";
import type { Request } from "express";
import type { Paginated } from "src/common/pagination/interfaces/paginatedInterface";

@Injectable()
export class PaginationProvider {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>
  ): Promise<Paginated<T>> {
    const page = paginationQuery.page ?? 1;
    const limit = paginationQuery.limit ?? 10;

    const results = await repository.find({
      skip: (page - 1) * limit,
      take: limit
    });

    const baseUrl = `${this.request.protocol}://${this.request.headers.host}/`;
    const newUrl = new URL(this.request.url, baseUrl);

    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / limit);

    const nextPage = page < totalPages ? page + 1 : totalPages;
    const previousPage = page > 1 ? page - 1 : 1;

    return {
      data: results,
      meta: {
        itemsPerPage: limit,
        totalItems,
        currentPage: page,
        totalPages
      },
      links: {
        first: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=1`,
        last: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${totalPages}`,
        current: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${page}`,
        next: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${nextPage}`,
        previous: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${previousPage}`
      }
    };
  }
}
