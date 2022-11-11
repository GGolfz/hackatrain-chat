import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext): number => {
	const request = ctx.switchToHttp().getRequest()
	console.log(request)
	return request.user?.user_id
})