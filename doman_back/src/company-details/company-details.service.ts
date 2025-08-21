import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { CompanyDetails } from "./company-details.model";

import { UpdateCompanyDetailsDto } from "./dto/updateCompanyDetails.dto";

@Injectable()
export class CompanyDetailsService {
	constructor(
		@InjectModel(CompanyDetails) private companyDetailsRepo: typeof CompanyDetails,
		private readonly logger: Logger
	) { }

	async getAllCompanyDetails(): Promise<CompanyDetails> {
		this.logger.debug('Fetching company details', CompanyDetailsService.name);

		const companyDetails = await this.companyDetailsRepo.findOne({ where: { id: 1 } }); // we have only one row here
		this.logger.log('Fetched company details', CompanyDetailsService.name);

		return companyDetails;
	}

	async updateCompanyDetails(dto: UpdateCompanyDetailsDto): Promise<CompanyDetails> {
		this.logger.debug('Creating or updating company details', CompanyDetailsService.name);

		const [companyDetails, isCreated] = await this.companyDetailsRepo.findOrCreate({
			where: { id: 1 },
			defaults: dto,
		});

		if (!isCreated) {
			const [_, updatedRows] = await this.companyDetailsRepo.update(
				dto,
				{ where: { id: 1 }, returning: true }
			);
			this.logger.log('Updated company details', CompanyDetailsService.name);

			return updatedRows[0];
		}

		this.logger.log('Created company details', CompanyDetailsService.name);
		return companyDetails;
	}
}
