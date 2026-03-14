import { Module } from "@nestjs/common";
import { PaginationProvider } from "./pagination";

@Module({
  providers: [PaginationProvider],
  exports: [PaginationProvider]
})
export class PaginationModule {}
