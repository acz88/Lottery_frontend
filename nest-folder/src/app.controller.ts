import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { openBetsDTO } from './dtos/openBets.dto';
import { buyTokensDTO } from './dtos/buyTokens.dto';
import { wihdrawTokensDTO } from './dtos/withdrawTokens.dto';
import { burnTokensDTO } from './dtos/burnTokens.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Post('open-bets')
  async openBets(@Body() body: openBetsDTO) {
    console.log({ body });
    return await this.appService.openBets(body.closingTime)
  }

  @Post('buy-tokens')
  async buyTokens(@Body() body: buyTokensDTO) {
    console.log({ body });
    return await this.appService.buyTokens(body.value);
  }

  @Post('withdraw-tokens')
  async withdrawTokens(@Body() body: wihdrawTokensDTO) {
    console.log({ body });
    return await this.appService.withdrawTokens(body.address, body.amount);
  }
  
  @Get('check-state')
  async checkState(){
    return await this.appService.checkState();
  }

  @Get('display-owner-pool')
  async displayOwnerPool(){
    return await this.appService.displayOwnerPool();
  }

   /// @notice Burns `amount` tokens and give the equivalent ETH back to user
  @Post('burn-tokens')
  async burnTokens(@Body() body: burnTokensDTO) {
    console.log({ body });
    return await this.appService.burnTokens(body.amount);
  }

  @Post('close-lottery')
  async closeLottery() {
    return await this.appService.closeLottery();
  }

  @Post('bet')
  async bet() {
    return await this.appService.bet();
  }

}
