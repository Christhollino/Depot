const error =  "\nInvalid `prisma.reservation.create()` invocation in\nC:\\Users\\NEUF9\\Desktop\\back-stage\\stage-L3Rebuild-back\\controllers\\cooperative\\reservation.ts:9:57\n\n  6 try {\n  7     const { date_reservation, id_cooperative } = req.body;\n  8 \n→ 9     const newReservation = await prisma.reservation.create(\nAn operation failed because it depends on one or more records that were required but not found. No 'Cooperative' record(s) (needed to inline the relation on 'Reservation' record(s)) was found for a nested connect on one-to-many relation 'CooperativeToReservation'."
console.log(error)