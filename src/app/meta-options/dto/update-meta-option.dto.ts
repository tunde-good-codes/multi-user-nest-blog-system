import { PartialType } from "@nestjs/mapped-types";
import { CreateMetaOptionDto } from "./create-meta-option.dto";

export class UpdateMetaOptionDto extends PartialType(CreateMetaOptionDto) {}
