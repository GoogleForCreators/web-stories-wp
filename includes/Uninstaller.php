<?php
/**
 * Uninstaller class.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2022 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

namespace Google\Web_Stories;

use Google\Web_Stories\Exception\InvalidService;
use Google\Web_Stories\Infrastructure\Delayed;
use Google\Web_Stories\Infrastructure\PluginUninstallAware;
use Google\Web_Stories\Infrastructure\Registerable;
use Google\Web_Stories\Infrastructure\Service;

/**
 * Uninstaller class.
 */
class Uninstaller extends Plugin {
	/**
	 * Override schedule_potential_service_registration method, to ignore delayed services.
	 *
	 * @since 1.26.0
	 *
	 * @param string       $id    ID of the service to register.
	 * @param class-string $class Class of the service to register.
	 */
	protected function schedule_potential_service_registration( $id, $class ): void {
		$this->maybe_register_service( $id, $class );
	}

	/**
	 * Register a single service, provided its conditions are met.
	 * Only register services that Uninstall aware service. Only call register in a case where the service is not delayed.
	 *
	 * @since 1.26.0
	 *
	 * @param string       $id    ID of the service to register.
	 * @param class-string $class Class of the service to register.
	 */
	protected function maybe_register_service( string $id, $class ): void {
		// Ensure we don't register the same service more than once.
		if ( $this->service_container->has( $id ) ) {
			return;
		}
		if ( ! is_a( $class, PluginUninstallAware::class, true ) ) {
			return;
		}

		$service = $this->instantiate_service( $class );

		$this->service_container->put( $id, $service );

		if ( $service instanceof Registerable && ! ( $service instanceof Delayed ) ) {
			$service->register();
		}
	}

	/**
	 * Instantiate a single service with no lazy loading services.
	 *
	 * @since 1.26.0
	 *
	 * @throws InvalidService If the service could not be properly instantiated.
	 *
	 * @param class-string|object $class Service class to instantiate.
	 * @return Service Instantiated service.
	 */
	protected function instantiate_service( $class ): Service {
		// The service needs to be registered, so instantiate right away.
		$service = $this->injector->make( $class );

		if ( ! $service instanceof Service ) {
			throw InvalidService::from_service( $service );
		}

		return $service;
	}
}
