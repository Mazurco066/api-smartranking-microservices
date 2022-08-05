// private async storeMatch(data: AssignChallengeDTO, category: string, players: ObjectId[]): Promise<Match> {
  //   try {

  //     const r =  await this.matchSchema.create({
  //       ...data,
  //       def: new ObjectId(data.def),
  //       category: category,
  //       players: players
  //     })
  //     return r

  //   } catch(err) {
  //     throw new MongoError(err)
  //   }
  // }