
ifeq ($(origin mablung-makefile-environment-path),undefined)
export mablung-makefile-environment-path := $(shell npx mablung-makefile-environment get-path)
endif

include $(mablung-makefile-environment-path)

# # --------------------
# .PHONY: migration-0
# # --------------------

# migration-0:: migration-0-argument := $(call get-argument,migration-0)
# migration-0:: build
# 	$(info - migration ----------------------------)
# 	@node $(node-parameter) ./release/command/index.js --configuration-path ./release/test/command/index-0.json $(or $(argument),$(migration-0-argument))

# # --------------------
# .PHONY: migration-1
# # --------------------

# migration-1:: migration-1-argument := $(call get-argument,migration-1)
# migration-1:: build
# 	$(info - migration ----------------------------)
# 	@node $(node-parameter) ./release/command/index.js --configuration-path ./release/test/command/index-1.json $(or $(argument),$(migration-1-argument))

# # --------------------
# .PHONY: migration-2
# # --------------------

# migration-2:: migration-2-argument := $(call get-argument,migration-2)
# migration-2:: build
# 	$(info - migration ----------------------------)
# 	@node $(node-parameter) ./release/command/index.js --configuration-path ./release/test/command/index-2.json $(or $(argument),$(migration-2-argument))

# # --------------------
# .PHONY: migration-3
# # --------------------

# migration-3:: migration-3-argument := $(call get-argument,migration-3)
# migration-3:: build
# 	$(info - migration ----------------------------)
# 	@node $(node-parameter) ./release/command/index.js --configuration-path ./release/test/command/index-3.json $(or $(argument),$(migration-3-argument))
