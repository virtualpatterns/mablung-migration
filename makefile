
ifeq ($(origin mablung-makefile-environment-path),undefined)
export mablung-makefile-environment-path := $(shell npx mablung-makefile-environment get-path)
endif

include $(mablung-makefile-environment-path)

# --------------------
.PHONY: file-system-migration
# --------------------

file-system-migration:: file-system-migration-argument := $(call get-argument,file-system-migration)
file-system-migration:: build
	$(info - migration ----------------------------)
	@node $(node-parameter) ./release/command/index.js --configuration-path ./release/test/library/file-system-migration.json $(or $(argument),$(file-system-migration-argument))
