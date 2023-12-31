import { Document, FilterQuery, Model, Types, UpdateQuery } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { Logger, NotFoundException } from "@nestjs/common";

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
    protected abstract readonly logger: Logger;

    constructor(protected readonly model: Model<TDocument>) { }

    async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
        const createdDocument = new this.model({
          ...document,
          _id: new Types.ObjectId(),
        });
        return (await createdDocument.save()).toJSON() as unknown as TDocument;
      }

    async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
        try {
            return await this.model.findOne(filterQuery, {}, { lean: true }) as TDocument;
        } catch (error) {
            this.logger.warn(`Document not found in ${this.model.modelName} collection`);
            throw new NotFoundException(`Document not found in ${this.model.modelName} collection`);
        }
    }

    async findOneAndUpdate(
        filterQuery: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>
    ){
        const document = await this.model.findOneAndUpdate(filterQuery, update,{
            lean: true,
            new: true,
        });

        if(!document){
            this.logger.warn(`Document not found in ${this.model.modelName} collection`);
            throw new NotFoundException(`Document not found in ${this.model.modelName} collection`);
        }

        return document;
    }

    async findAll(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]>{
        return await this.model.find(filterQuery, {}, { lean: true }) as TDocument[];
    }

    async findOneAndDelete(filterQuery: FilterQuery<TDocument>){
        return this.model.findOneAndDelete(filterQuery), {lean: true};
    }
}